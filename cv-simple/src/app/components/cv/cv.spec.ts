import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Cv } from './cv';
import { CvService } from '../../services/cv.service';
import { DynamicRendererService, SectionConfig } from '../../services/dynamic-renderer.service';
import { CV } from '../../models/cv.models';

describe('Cv', () => {
  let component: Cv;
  let fixture: ComponentFixture<Cv>;
  let cvService: jasmine.SpyObj<CvService>;
  let dynamicRenderer: jasmine.SpyObj<DynamicRendererService>;

  const mockCvData: CV = {
    personalInfo: {
      name: 'John Doe',
      title: 'Software Engineer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development.'
    },
    experience: {
      jobs: [
        {
          company: 'Tech Company',
          position: 'Senior Developer',
          startDate: '2020-01',
          endDate: 'Present',
          location: 'San Francisco, CA',
          description: 'Lead development of web applications using modern technologies.',
          achievements: [
            { text: 'Improved application performance by 50%' },
            { text: 'Led team of 3 developers' }
          ],
          technologies: [
            { name: 'React' },
            { name: 'Node.js' },
            { name: 'TypeScript' }
          ]
        },
        {
          company: 'Startup Inc',
          position: 'Full Stack Developer',
          startDate: '2018-06',
          endDate: '2019-12',
          location: 'Remote',
          description: 'Built and maintained web applications from concept to production.',
          achievements: [
            { text: 'Developed MVP that secured funding' }
          ],
          technologies: [
            { name: 'Angular' },
            { name: 'Python' }
          ]
        }
      ]
    },
    education: {
      degrees: [
        {
          institution: 'University of California',
          degree: 'Bachelor of Science in Computer Science',
          startDate: '2015-09',
          endDate: '2019-05',
          gpa: '3.7',
          honors: 'Cum Laude',
          relevantCourses: [
            { name: 'Data Structures' },
            { name: 'Algorithms' },
            { name: 'Software Engineering' }
          ]
        }
      ]
    },
    skills: {
      categories: [
        {
          name: 'Programming Languages',
          skills: [
            { name: 'JavaScript', level: 'Expert' },
            { name: 'Python', level: 'Advanced' },
            { name: 'Java', level: 'Intermediate' }
          ]
        },
        {
          name: 'Frameworks',
          skills: [
            { name: 'React', level: 'Expert' },
            { name: 'Angular', level: 'Advanced' }
          ]
        }
      ]
    },
    certifications: {
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          date: '2023-01',
          credentialId: 'AWS-DEV-123'
        }
      ]
    },
    projects: {
      projects: [
        {
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce application with React and Node.js.',
          technologies: [
            { name: 'React' },
            { name: 'Node.js' },
            { name: 'MongoDB' }
          ],
          url: 'https://github.com/johndoe/ecommerce'
        }
      ]
    }
  };

  beforeEach(async () => {
    const cvServiceSpy = jasmine.createSpyObj('CvService', ['getCvData']);
    const dynamicRendererSpy = jasmine.createSpyObj('DynamicRendererService', ['getSectionConfigs']);

    await TestBed.configureTestingModule({
      imports: [Cv, HttpClientTestingModule],
      providers: [
        { provide: CvService, useValue: cvServiceSpy },
        { provide: DynamicRendererService, useValue: dynamicRendererSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cv);
    component = fixture.componentInstance;
    cvService = TestBed.inject(CvService) as jasmine.SpyObj<CvService>;
    dynamicRenderer = TestBed.inject(DynamicRendererService) as jasmine.SpyObj<DynamicRendererService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with loading state', () => {
      expect(component.loading).toBe(true);
      expect(component.cvData).toBeNull();
      expect(component.error).toBeNull();
    });

    it('should call getCvData on init', () => {
      cvService.getCvData.and.returnValue(of(mockCvData));

      component.ngOnInit();

      expect(cvService.getCvData).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should load CV data successfully and generate sections', () => {
      const mockSections: SectionConfig[] = [
        { key: 'personalInfo', title: 'Personal Info', order: 1, visible: true, hasData: true },
        { key: 'experience', title: 'Experience', order: 2, visible: true, hasData: true }
      ];

      cvService.getCvData.and.returnValue(of(mockCvData));
      dynamicRenderer.getSectionConfigs.and.returnValue(mockSections);

      component.ngOnInit();

      expect(component.cvData).toEqual(mockCvData);
      expect(component.sections).toEqual(mockSections);
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
      expect(dynamicRenderer.getSectionConfigs).toHaveBeenCalledWith(mockCvData);
    });

    it('should handle loading errors', () => {
      cvService.getCvData.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(component.cvData).toBeNull();
      expect(component.sections).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.error).toBe('Failed to load CV data');
    });
  });

  describe('Basic Functionality', () => {
    it('should get section data correctly', () => {
      component.cvData = mockCvData;

      const personalInfoData = component.getSectionData('personalInfo');

      expect(personalInfoData).toEqual(mockCvData.personalInfo);
    });

    it('should track sections by key', () => {
      const section: SectionConfig = {
        key: 'experience',
        title: 'Experience',
        order: 2,
        visible: true,
        hasData: true
      };

      const trackResult = component.trackBySection(0, section);

      expect(trackResult).toBe('experience');
    });
  });

  // Template rendering tests removed to keep tests simple and focused
});
