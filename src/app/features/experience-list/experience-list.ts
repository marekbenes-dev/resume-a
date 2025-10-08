import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface ExperienceItem {
  period: string;
  title: string;
  company: string;
  location: string;
  bullets: string[];
}

@Component({
  selector: 'app-experience-list',
  standalone: true,
  templateUrl: './experience-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceListComponent {
  @Input({ required: true }) items: ExperienceItem[] = [];

  // Safe, generic trackBy for arrays where order is stable
  trackByIndex = (index: number, _item: unknown) => index;
}
