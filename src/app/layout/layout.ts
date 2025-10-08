import { Component } from '@angular/core';
import { LeftNavComponent } from './left-nav/left-nav';
import { MainComponent } from '../features/main/main';

@Component({
  selector: 'app-layout',
  imports: [LeftNavComponent, MainComponent],
  templateUrl: './layout.html',
  styles: [``],
})
export class LayoutComponent {}
