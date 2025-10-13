import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

function getThemeFromRequest(req: express.Request): 'dark' | 'light' | undefined {
  // 1) cookie: theme=dark|light
  const m = req.headers.cookie?.match(/(?:^|;\s*)theme=(dark|light)/i);
  if (m) return m[1].toLowerCase() as 'dark' | 'light';

  // 2) Client Hint: Sec-CH-Prefers-Color-Scheme: dark|light
  const ch = req.headers['sec-ch-prefers-color-scheme'];
  if (typeof ch === 'string' && (ch === 'dark' || ch === 'light')) return ch;

  return undefined;
}

function isHtmlResponse(res: Response | undefined) {
  const ct = res?.headers.get('content-type') || '';
  return ct.includes('text/html');
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * SSR handler with theme injection.
 */
app.use(async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);
    if (!response) return next();

    // Ask the browser to send the Client Hint on subsequent requests.
    res.setHeader('Accept-CH', 'Sec-CH-Prefers-Color-Scheme');

    if (!isHtmlResponse(response)) {
      // Non-HTML: just pipe through.
      return writeResponseToNodeResponse(response, res);
    }

    const html = await response.text();
    const theme = getThemeFromRequest(req);

    // Inject class/style onto <html …> to avoid first-paint flicker.
    const injected =
      theme === 'dark'
        ? html.replace('<html', '<html class="dark" style="color-scheme:dark"')
        : theme === 'light'
          ? html.replace('<html', '<html style="color-scheme:light"')
          : html;

    // Rebuild a Response with identical status/headers.
    const headers = new Headers(response.headers);
    const themedResponse = new Response(injected, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    return writeResponseToNodeResponse(themedResponse, res);
  } catch (err) {
    return next(err);
  }
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
