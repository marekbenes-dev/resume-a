import { Component, Input } from '@angular/core';

export interface ExperienceItem {
  period: string;
  title: string;
  company: string;
  location: string;
  bullets: string[];
}

@Component({
  selector: 'app-experience-list',
  templateUrl: './experience-list.html',
})
export class ExperienceListComponent {
  @Input({ required: true }) items: ExperienceItem[] = [];
}
