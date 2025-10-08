import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-json-ld',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonLdComponent implements OnInit, OnDestroy {
  @Input({ required: true }) jsonLd!: unknown;
  private doc = inject(DOCUMENT);
  private el?: HTMLScriptElement;
  private platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    // only run on the server
    if (this.isBrowser) return; 

    this.el = this.renderer.createElement('script');

    if (this.el) {  
      this.el.type = 'application/ld+json';
      this.el.text = JSON.stringify(this.jsonLd);
      this.renderer.appendChild(this.doc.head, this.el);
    }
  }
  ngOnDestroy(): void {
    if (this.el) this.renderer.removeChild(this.doc.head, this.el);
  }
}
