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

app.use(async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);
    if (!response) return next();

    // Only touch the root document and only on 200 OK
    if (req.path !== '/' || response.status !== 200) {
      return writeResponseToNodeResponse(response, res);
    }

    const theme = getThemeFromRequest(req); // 'dark' | 'light' | undefined
    console.log(`Theme requested: ${theme}`);
    if (theme !== 'dark') {
      // light/auto → don’t modify; just send as-is
      return writeResponseToNodeResponse(response, res);
    }

    // Dark: inject once, using a simple token replace
    const html = await response.text();
    const injected = html.replace('<html', '<html class="dark" style="color-scheme:dark"');

    console.log(`Injecting dark mode into <html> element`);

    const headers = new Headers(response.headers);
    // Body changed → drop ETag (and optionally weaken caching)
    headers.delete('etag');
    if (!headers.has('content-type')) {
      headers.set('content-type', 'text/html; charset=utf-8');
    }

    const themed = new Response(injected, {
      status: 200,
      statusText: response.statusText,
      headers,
    });

    return writeResponseToNodeResponse(themed, res);
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
