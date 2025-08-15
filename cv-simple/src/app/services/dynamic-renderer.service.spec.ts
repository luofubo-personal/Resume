import { TestBed } from '@angular/core/testing';
import { DynamicRendererService } from './dynamic-renderer.service';
import { CV } from '../models/cv.models';

describe('DynamicRendererService', () => {
  let service: DynamicRendererService;

  const mockCvData: CV = {
    personalInfo: {
      name: 'John Doe',
      title: 'Software Engineer',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      summary: 'Experienced developer'
    },
    experience: {
      jobs: [
        {
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2020-01',
          endDate: 'Present',
          location: 'SF, CA',
          description: 'Lead development',
          achievements: [{ text: 'Built great things' }],
          technologies: [{ name: 'React' }]
        }
      ]
    },
    education: {
      degrees: [
        {
          institution: 'University',
          degree: 'BS Computer Science',
          startDate: '2015-09',
          endDate: '2019-05',
          relevantCourses: [{ name: 'Algorithms' }]
        }
      ]
    },
    skills: {
      categories: [
        {
          name: 'Programming',
          skills: [{ name: 'JavaScript', level: 'Expert' }]
        }
      ]
    },
    certifications: {
      certifications: [
        {
          name: 'AWS Certified',
          issuer: 'Amazon',
          date: '2023-01'
        }
      ]
    },
    projects: {
      projects: [
        {
          name: 'Cool Project',
          description: 'A cool project',
          technologies: [{ name: 'React' }]
        }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate section configs based on CV data', () => {
    const sections = service.getSectionConfigs(mockCvData);
    
    expect(sections.length).toBe(6);
    expect(sections[0].key).toBe('personalInfo');
    expect(sections[1].key).toBe('experience');
    expect(sections[2].key).toBe('education');
    expect(sections[3].key).toBe('skills');
    expect(sections[4].key).toBe('certifications');
    expect(sections[5].key).toBe('projects');
  });

  it('should only include sections with data', () => {
    const emptyCvData: CV = {
      personalInfo: {
        name: 'John Doe',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'San Francisco, CA',
        summary: 'Experienced developer'
      },
      experience: { jobs: [] },
      education: { degrees: [] },
      skills: { categories: [] },
      certifications: { certifications: [] },
      projects: { projects: [] }
    };

    const sections = service.getSectionConfigs(emptyCvData);
    
    expect(sections.length).toBe(1); // Only personalInfo should be included
    expect(sections[0].key).toBe('personalInfo');
  });

  it('should generate personal info fields correctly', () => {
    const fields = service.getPersonalInfoFields(mockCvData.personalInfo);
    
    expect(fields.length).toBe(6); // name, title, email, phone, location, summary
    expect(fields.find(f => f.key === 'name')).toBeTruthy();
    expect(fields.find(f => f.key === 'email')).toBeTruthy();
    expect(fields.find(f => f.key === 'phone')).toBeTruthy();
  });

  it('should format field values correctly', () => {
    const textField = { key: 'name', label: 'Name', type: 'text' as const, visible: true };
    const dateField = { key: 'date', label: 'Date', type: 'date' as const, visible: true, format: 'YYYY-MM' };
    const listField = { key: 'techs', label: 'Technologies', type: 'list' as const, visible: true };

    expect(service.formatFieldValue('John Doe', textField)).toBe('John Doe');
    expect(service.formatFieldValue('2023-01', dateField)).toBe('Jan 2023');
    expect(service.formatFieldValue([{ name: 'React' }, { name: 'Node.js' }], listField)).toBe('React, Node.js');
  });

  it('should handle Present date correctly', () => {
    const dateField = { key: 'date', label: 'Date', type: 'date' as const, visible: true, format: 'YYYY-MM' };
    expect(service.formatFieldValue('Present', dateField)).toBe('Present');
  });
});
