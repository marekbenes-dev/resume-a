import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../../features/theme-toggle/theme-toggle';

interface Section {
  id: string;
  label: string;
}

@Component({
  selector: 'app-left-nav',
  imports: [ThemeToggleComponent],
  templateUrl: './left-nav.html',
  styles: []
})
export class LeftNavComponent {
 sections: Section[] = [
  { id: "about",   label: "About" },
  { id: "experience",label: "Experience" },
  { id: "projects",  label: "Projects" },
  { id: "skills",    label: "Skills" },
  { id: "education", label: "Education" },
  { id: "last-race", label: "Last Race" },
  { id: "contact",   label: "Contact" },
];
}
