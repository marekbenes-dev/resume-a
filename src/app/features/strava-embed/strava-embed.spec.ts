import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StravaEmbed } from './strava-embed';

describe('StravaEmbed', () => {
  let component: StravaEmbed;
  let fixture: ComponentFixture<StravaEmbed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StravaEmbed],
    }).compileComponents();

    fixture = TestBed.createComponent(StravaEmbed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
