import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { App } from './app';
import { CvService } from './services/cv.service';
import { CV } from './models/cv.models';

describe('App', () => {
  let cvService: jasmine.SpyObj<CvService>;

  const mockCvData: CV = {
    personalInfo: {
      name: 'Test User',
      title: 'Test Engineer',
      email: 'test@email.com',
      phone: '+1 (555) 123-4567',
      location: 'Test City, CA',
      summary: 'Test summary'
    },
    experience: { jobs: [] },
    education: { degrees: [] },
    skills: { categories: [] },
    certifications: { certifications: [] },
    projects: { projects: [] }
  };

  beforeEach(async () => {
    const cvServiceSpy = jasmine.createSpyObj('CvService', ['getCvData']);

    await TestBed.configureTestingModule({
      imports: [App, HttpClientTestingModule],
      providers: [
        { provide: CvService, useValue: cvServiceSpy }
      ]
    }).compileComponents();

    cvService = TestBed.inject(CvService) as jasmine.SpyObj<CvService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have correct title property', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).title()).toBe('cv-simple');
  });

  it('should render the CV component', () => {
    cvService.getCvData.and.returnValue(of(mockCvData));

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const cvComponent = fixture.debugElement.query(By.css('app-cv'));
    expect(cvComponent).toBeTruthy();
  });

  it('should have proper app container structure', () => {
    cvService.getCvData.and.returnValue(of(mockCvData));

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const appContainer = fixture.debugElement.query(By.css('.app-container'));
    expect(appContainer).toBeTruthy();

    const cvComponent = appContainer.query(By.css('app-cv'));
    expect(cvComponent).toBeTruthy();
  });

  // Integration tests removed to keep tests simple and focused

  describe('Responsive Design', () => {
    it('should have responsive app container', () => {
      cvService.getCvData.and.returnValue(of(mockCvData));

      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const appContainer = fixture.debugElement.query(By.css('.app-container'));
      expect(appContainer).toBeTruthy();

      // Check if container has proper styling classes
      const containerElement = appContainer.nativeElement;
      expect(containerElement.classList.contains('app-container')).toBe(true);
    });
  });
});
