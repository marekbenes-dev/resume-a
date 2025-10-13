import { AfterViewInit, Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, NgClass } from '@angular/common';
import { ThemeToggleComponent } from '../../features/theme-toggle/theme-toggle';

interface Section {
  id: string;
  label: string;
}

@Component({
  selector: 'app-left-nav',
  imports: [ThemeToggleComponent, NgClass],
  templateUrl: './left-nav.html',
})
export class LeftNavComponent implements AfterViewInit {
  mail = 'benes.developer@gmail.com';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  sections: Section[] = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'last-race', label: 'Last Race' },
    { id: 'contact', label: 'Contact' },
  ];

  // state
  activeId = signal<string | null>(null);
  clicked = signal(false);

  private obs: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // initial hash -> highlight immediately (optional)
    const initial = this.doc.defaultView?.location.hash?.slice(1) || null;
    if (initial) this.activeId.set(initial);

    this.obs = new IntersectionObserver(
      (entries) => {
        const clickedNow = this.clicked();
        const current = this.activeId();

        for (const e of entries) {
          const id = (e.target as HTMLElement).id;

          // if we previously clicked a link, resume scroll-driven updates
          // once the clicked section actually intersects (slight delay to avoid flicker)
          if (clickedNow && current === id && e.isIntersecting) {
            setTimeout(() => this.clicked.set(false), 300);
          }

          // only let scroll drive the active section when NOT in "clicked" mode
          if (e.isIntersecting && !this.clicked()) {
            this.activeId.set(id);
          }
        }
      },
      { rootMargin: '-25% 0px -70% 0px', threshold: [0, 1] },
    );

    // start observing all section elements by id
    for (const { id } of this.sections) {
      const el = this.doc.getElementById(id);
      if (el) this.obs.observe(el);
    }

    // cleanup
    this.destroyRef.onDestroy(() => {
      this.obs?.disconnect();
      this.obs = null;
    });
  }

  handleClick(ev: MouseEvent, id: string): void {
    if (!this.isBrowser) return;
    // pause scroll-driven updates
    this.clicked.set(true);
    // set active immediately for instant highlight
    this.activeId.set(id);

    // optional: smooth scroll & focus the section heading for a11y
    ev.preventDefault();
    const el = this.doc.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // move focus to the section container/heading if it can be focused
      (el as HTMLElement).tabIndex ??= -1;
      (el as HTMLElement).focus({ preventScroll: true });
    }

    // keep URL hash in sync without full navigation
    this.doc.defaultView?.history.replaceState(null, '', `#${id}`);
  }

  // convenience for templates
  isActive(id: string) {
    return this.activeId() === id;
  }
}
