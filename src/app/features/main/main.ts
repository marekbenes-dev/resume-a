import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceListComponent } from '../experience-list/experience-list';
import { JsonLdComponent } from '../json-ld/json-ld';
import { StravaEmbedComponent } from '../strava-embed/strava-embed';

type NavSection = {
  id: string;
  label: string;
};

type ExperienceItem = {
  period: string;
  title: string;
  company: string;
  location: string;
  bullets: string[];
};

@Component({
  selector: 'app-main',
  imports: [CommonModule, ExperienceListComponent, JsonLdComponent, StravaEmbedComponent],
  templateUrl: './main.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  readonly sections: NavSection[] = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'last-race', label: 'Last Race' },
    { id: 'contact', label: 'Contact' },
  ];

  readonly experience: ExperienceItem[] = [
    {
      period: '2024 - 2025',
      title: 'Senior Front End Developer',
      company: 'SIKO',
      location: 'Prague, Czechia',
      bullets: [
        'Migrated a large JSP monolith to modern Angular',
        'Improved performance (reached optimal values in Core Web Vitals)',
        'Was in charge of monitoring Web Vitals and maintaining good SEO',
        'Organized FE sync meetings to share knowledge and improve code quality',
        'Oversaw PayPal integration for Germany',
      ],
    },
    {
      period: '2021 - 2024',
      title: 'Front End Developer',
      company: 'Actum Digital',
      location: 'Prague, Czechia',
      bullets: [
        'Delivered two Angular applications for two clients',
        'Was in charge of responsive design',
      ],
    },
    {
      period: '2020 - 2021',
      title: 'Front End Developer',
      company: 'Alza',
      location: 'Prague, Czechia',
      bullets: [
        'Contributed to the development of a large ERP platform using Angular',
        'Used GraphQL for efficient data fetching',
      ],
    },
    {
      period: '2019 - 2020',
      title: 'Fullstack Developer',
      company: 'Robotron Datenbank-Software',
      location: 'Dresden, Germany',
      bullets: [
        "Contributed to the development of client' platform using Angular",
        'Built application from scratch using MEAN stack (MongoDB, Express, Angular, Node.js)',
      ],
    },
    {
      period: '2018 - 2019',
      title: 'Front End Developer',
      company: 'CompuGroup Medical',
      location: 'Prague, Czechia',
      bullets: ['Contributed to the development of medical platform using AngularJS'],
    },
  ];

  // JSON-LD for Person (will be injected into <head>)
  readonly personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Marek Beneš',
    jobTitle: 'FE developer',
    url: 'https://example.com',
    sameAs: [
      'https://github.com/marekbenes-dev',
      'https://www.linkedin.com/in/marek-beneš-936279154/',
    ],
  } as const;

  readonly currentYear = 2025;
}
