import { AfterViewInit, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      class="border px-3 py-1 rounded text-sm cursor-pointer"
      (click)="toggle()"
      aria-label="Toggle dark mode"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {{ icon() }}
      </span>
      <span className="select-none">Switch Mode</span>
    </button>
  `,
})
export class ThemeToggleComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  readonly isBrowser = isPlatformBrowser(this.platformId);
  icon = signal<string>('🌗');

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const stored = localStorage.getItem('marek-resume-theme');
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

    const useDark = stored ? stored === 'dark' : !!prefersDark;

    this.switchIcon();
    this.doc.documentElement.classList.toggle('dark', useDark);
  }

  switchIcon(): void {
    this.icon.set(this.doc.documentElement.classList.contains('dark') ? '🌙' : '🌞');
  }

  toggle(): void {
    if (!this.isBrowser) return;
    const isDark = this.doc.documentElement.classList.toggle('dark');
    localStorage.setItem('marek-resume-theme', isDark ? 'dark' : 'light');
    this.switchIcon();
  }
}
