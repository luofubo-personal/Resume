import { Injectable } from '@angular/core';
import { CV, PersonalInfo, Job, Degree, SkillCategory, Certification, Project } from '../models/cv.models';

export interface SectionConfig {
  key: string;
  title: string;
  icon?: string;
  order: number;
  visible: boolean;
  hasData: boolean;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'url' | 'date' | 'list' | 'object' | 'array';
  visible: boolean;
  required?: boolean;
  format?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicRendererService {

  getSectionConfigs(cvData: CV): SectionConfig[] {
    return [
      {
        key: 'personalInfo',
        title: 'Personal Information',
        icon: 'person',
        order: 1,
        visible: true,
        hasData: !!cvData.personalInfo
      },
      {
        key: 'experience',
        title: 'Professional Experience',
        icon: 'work',
        order: 2,
        visible: true,
        hasData: cvData.experience?.jobs?.length > 0
      },
      {
        key: 'education',
        title: 'Education',
        icon: 'school',
        order: 3,
        visible: true,
        hasData: cvData.education?.degrees?.length > 0
      },
      {
        key: 'skills',
        title: 'Skills & Technologies',
        icon: 'code',
        order: 4,
        visible: true,
        hasData: cvData.skills?.categories?.length > 0
      },
      {
        key: 'certifications',
        title: 'Certifications',
        icon: 'verified',
        order: 5,
        visible: cvData.certifications?.certifications?.length > 0,
        hasData: cvData.certifications?.certifications?.length > 0
      },
      {
        key: 'projects',
        title: 'Projects',
        icon: 'folder',
        order: 6,
        visible: cvData.projects?.projects?.length > 0,
        hasData: cvData.projects?.projects?.length > 0
      }
    ].filter(section => section.hasData);
  }

  getPersonalInfoFields(personalInfo: PersonalInfo): FieldConfig[] {
    const fields: FieldConfig[] = [];
    
    if (personalInfo.name) {
      fields.push({ key: 'name', label: 'Name', type: 'text', visible: true, required: true });
    }
    if (personalInfo.title) {
      fields.push({ key: 'title', label: 'Title', type: 'text', visible: true, required: true });
    }
    if (personalInfo.email) {
      fields.push({ key: 'email', label: 'Email', type: 'email', visible: true });
    }
    if (personalInfo.phone) {
      fields.push({ key: 'phone', label: 'Phone', type: 'phone', visible: true });
    }
    if (personalInfo.location) {
      fields.push({ key: 'location', label: 'Location', type: 'text', visible: true });
    }
    if (personalInfo.linkedin) {
      fields.push({ key: 'linkedin', label: 'LinkedIn', type: 'url', visible: true });
    }
    if (personalInfo.github) {
      fields.push({ key: 'github', label: 'GitHub', type: 'url', visible: true });
    }
    if (personalInfo.website) {
      fields.push({ key: 'website', label: 'Website', type: 'url', visible: true });
    }
    if (personalInfo.summary) {
      fields.push({ key: 'summary', label: 'Summary', type: 'text', visible: true });
    }

    return fields;
  }

  getJobFields(job: Job): FieldConfig[] {
    const fields: FieldConfig[] = [];
    
    if (job.company) {
      fields.push({ key: 'company', label: 'Company', type: 'text', visible: true, required: true });
    }
    if (job.position) {
      fields.push({ key: 'position', label: 'Position', type: 'text', visible: true, required: true });
    }
    if (job.startDate) {
      fields.push({ key: 'startDate', label: 'Start Date', type: 'date', visible: true, format: 'YYYY-MM' });
    }
    if (job.endDate) {
      fields.push({ key: 'endDate', label: 'End Date', type: 'date', visible: true, format: 'YYYY-MM' });
    }
    if (job.location) {
      fields.push({ key: 'location', label: 'Location', type: 'text', visible: true });
    }
    if (job.description) {
      fields.push({ key: 'description', label: 'Description', type: 'text', visible: true });
    }
    if (job.achievements?.length > 0) {
      fields.push({ key: 'achievements', label: 'Achievements', type: 'list', visible: true });
    }
    if (job.technologies?.length > 0) {
      fields.push({ key: 'technologies', label: 'Technologies', type: 'list', visible: true });
    }

    return fields;
  }

  getDegreeFields(degree: Degree): FieldConfig[] {
    const fields: FieldConfig[] = [];
    
    if (degree.institution) {
      fields.push({ key: 'institution', label: 'Institution', type: 'text', visible: true, required: true });
    }
    if (degree.degree) {
      fields.push({ key: 'degree', label: 'Degree', type: 'text', visible: true, required: true });
    }
    if (degree.startDate) {
      fields.push({ key: 'startDate', label: 'Start Date', type: 'date', visible: true, format: 'YYYY-MM' });
    }
    if (degree.endDate) {
      fields.push({ key: 'endDate', label: 'End Date', type: 'date', visible: true, format: 'YYYY-MM' });
    }
    if (degree.gpa) {
      fields.push({ key: 'gpa', label: 'GPA', type: 'text', visible: true });
    }
    if (degree.honors) {
      fields.push({ key: 'honors', label: 'Honors', type: 'text', visible: true });
    }
    if (degree.relevantCourses?.length > 0) {
      fields.push({ key: 'relevantCourses', label: 'Relevant Courses', type: 'list', visible: true });
    }

    return fields;
  }

  getSkillCategoryFields(category: SkillCategory): FieldConfig[] {
    const fields: FieldConfig[] = [];
    
    if (category.name) {
      fields.push({ key: 'name', label: 'Category', type: 'text', visible: true, required: true });
    }
    if (category.skills?.length > 0) {
      fields.push({ key: 'skills', label: 'Skills', type: 'array', visible: true });
    }

    return fields;
  }

  getCertificationFields(certification: Certification): FieldConfig[] {
    const fields: FieldConfig[] = [];
    
    if (certification.name) {
      fields.push({ key: 'name', label: 'Certification', type: 'text', visible: true, required: true });
    }
    if (certification.issuer) {
      fields.push({ key: 'issuer', label: 'Issuer', type: 'text', visible: true });
    }
    if (certification.date) {
      fields.push({ key: 'date', label: 'Date', type: 'date', visible: true, format: 'YYYY-MM' });
    }
    if (certification.credentialId) {
      fields.push({ key: 'credentialId', label: 'Credential ID', type: 'text', visible: true });
    }

    return fields;
  }

  getProjectFields(project: Project): FieldConfig[] {
    const fields: FieldConfig[] = [];
    
    if (project.name) {
      fields.push({ key: 'name', label: 'Project Name', type: 'text', visible: true, required: true });
    }
    if (project.description) {
      fields.push({ key: 'description', label: 'Description', type: 'text', visible: true });
    }
    if (project.technologies?.length > 0) {
      fields.push({ key: 'technologies', label: 'Technologies', type: 'list', visible: true });
    }
    if (project.url) {
      fields.push({ key: 'url', label: 'Project URL', type: 'url', visible: true });
    }

    return fields;
  }

  formatFieldValue(value: unknown, field: FieldConfig): string {
    if (!value) return '';

    switch (field.type) {
      case 'date':
        if (field.format === 'YYYY-MM') {
          return this.formatDate(String(value));
        }
        return String(value);
      case 'list':
        if (Array.isArray(value)) {
          return value.map(item => typeof item === 'object' && item !== null ?
            (item as Record<string, unknown>)['text'] || (item as Record<string, unknown>)['name'] || String(item) :
            String(item)).join(', ');
        }
        return String(value);
      case 'array':
        if (Array.isArray(value)) {
          return value.map(item => {
            if (typeof item === 'object' && item !== null) {
              const obj = item as Record<string, unknown>;
              return `${obj['name'] || 'Unknown'} (${obj['level'] || 'Unknown'})`;
            }
            return String(item);
          }).join(', ');
        }
        return String(value);
      default:
        return String(value);
    }
  }

  private formatDate(dateStr: string): string {
    if (dateStr === 'Present') return 'Present';
    
    const [year, month] = dateStr.split('-');
    if (!month) return year;
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }
}
