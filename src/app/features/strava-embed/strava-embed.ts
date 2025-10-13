import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  PLATFORM_ID,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-strava-embed',
  template: `
    <div #host>
      <div
        class="strava-embed-placeholder"
        data-embed-type="activity"
        [attr.data-embed-id]="activityId"
        data-style="standard"
        data-from-embed="false"
      ></div>
    </div>
  `,
})
export class StravaEmbedComponent implements AfterViewInit {
  @Input({ required: true }) activityId!: string;

  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  @ViewChild('host', { static: true }) host!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const src = 'https://strava-embeds.com/embed.js';

    // Always append a *new* script tag so the library rescans placeholders.
    const s = this.renderer.createElement('script') as HTMLScriptElement;
    s.src = src;
    s.async = true;

    // Optional: remove the tag after it executes to avoid clutter
    s.onload = () => setTimeout(() => s.remove(), 0);

    // Append near the placeholder (or use this.doc.body)
    this.renderer.appendChild(this.host.nativeElement, s);
  }
}
