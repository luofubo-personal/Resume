import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field';
import { SectionConfig, FieldConfig, DynamicRendererService } from '../../services/dynamic-renderer.service';
import { PersonalInfo } from '../../models/cv.models';

@Component({
  selector: 'app-dynamic-section',
  standalone: true,
  imports: [CommonModule, DynamicFieldComponent],
  template: `
    <section class="cv-section" [ngClass]="'section-' + sectionConfig.key">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon" [innerHTML]="getSectionIcon()"></span>
          {{ sectionConfig.title }}
        </h2>
      </div>

      <div class="section-content" [ngSwitch]="sectionConfig.key">
        
        <!-- Personal Info Section -->
        <div *ngSwitchCase="'personalInfo'" class="personal-info-content">
          <div class="personal-header">
            <h1 *ngIf="hasDataProperty('name')" class="person-name">{{ getDataProperty('name') }}</h1>
            <h2 *ngIf="hasDataProperty('title')" class="person-title">{{ getDataProperty('title') }}</h2>
          </div>

          <div class="contact-info">
            <div *ngFor="let field of getPersonalInfoFields()" class="contact-item">
              <app-dynamic-field
                [field]="field"
                [value]="getDataProperty(field.key)">
              </app-dynamic-field>
            </div>
          </div>

          <div *ngIf="hasDataProperty('summary')" class="summary">
            <p>{{ getDataProperty('summary') }}</p>
          </div>
        </div>

        <!-- Experience Section -->
        <div *ngSwitchCase="'experience'" class="experience-content">
          <div *ngFor="let job of getDataArray('jobs')" class="job-item">
            <div class="job-header">
              <h3 class="job-title">{{ getItemProperty(job, 'position') }}</h3>
              <h4 class="job-company">{{ getItemProperty(job, 'company') }}</h4>
              <div class="job-meta">
                <span class="job-dates">
                  {{ formatItemDate(job, 'startDate') }} - {{ formatItemDate(job, 'endDate') }}
                </span>
                <span *ngIf="hasItemProperty(job, 'location')" class="job-location">{{ getItemProperty(job, 'location') }}</span>
              </div>
            </div>

            <div class="job-content">
              <p *ngIf="hasItemProperty(job, 'description')" class="job-description">{{ getItemProperty(job, 'description') }}</p>

              <div *ngIf="hasItemArrayWithLength(job, 'achievements')" class="achievements">
                <h5>Key Achievements:</h5>
                <ul>
                  <li *ngFor="let achievement of getItemArray(job, 'achievements')">{{ getItemProperty(achievement, 'text') }}</li>
                </ul>
              </div>

              <div *ngIf="hasItemArrayWithLength(job, 'technologies')" class="technologies">
                <h5>Technologies Used:</h5>
                <app-dynamic-field
                  [field]="{key: 'technologies', label: 'Technologies', type: 'list', visible: true}"
                  [value]="getItemProperty(job, 'technologies')">
                </app-dynamic-field>
              </div>
            </div>
          </div>
        </div>

        <!-- Education Section -->
        <div *ngSwitchCase="'education'" class="education-content">
          <div *ngFor="let degree of getDataArray('degrees')" class="degree-item">
            <div class="degree-header">
              <h3 class="degree-title">{{ getItemProperty(degree, 'degree') }}</h3>
              <h4 class="degree-institution">{{ getItemProperty(degree, 'institution') }}</h4>
              <div class="degree-meta">
                <span class="degree-dates">
                  {{ formatItemDate(degree, 'startDate') }} - {{ formatItemDate(degree, 'endDate') }}
                </span>
                <span *ngIf="hasItemProperty(degree, 'gpa')" class="degree-gpa">GPA: {{ getItemProperty(degree, 'gpa') }}</span>
                <span *ngIf="hasItemProperty(degree, 'honors')" class="degree-honors">{{ getItemProperty(degree, 'honors') }}</span>
              </div>
            </div>

            <div *ngIf="hasItemArrayWithLength(degree, 'relevantCourses')" class="relevant-courses">
              <h5>Relevant Courses:</h5>
              <app-dynamic-field
                [field]="{key: 'relevantCourses', label: 'Courses', type: 'list', visible: true}"
                [value]="getItemProperty(degree, 'relevantCourses')">
              </app-dynamic-field>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div *ngSwitchCase="'skills'" class="skills-content">
          <div *ngFor="let category of getDataArray('categories')" class="skill-category">
            <h3 class="category-title">{{ getItemProperty(category, 'name') }}</h3>
            <div class="skills-list">
              <app-dynamic-field
                [field]="{key: 'skills', label: 'Skills', type: 'array', visible: true}"
                [value]="getItemProperty(category, 'skills')">
              </app-dynamic-field>
            </div>
          </div>
        </div>

        <!-- Certifications Section -->
        <div *ngSwitchCase="'certifications'" class="certifications-content">
          <div *ngFor="let cert of getDataArray('certifications')" class="certification-item">
            <div class="cert-header">
              <h3 class="cert-name">{{ getItemProperty(cert, 'name') }}</h3>
              <h4 class="cert-issuer">{{ getItemProperty(cert, 'issuer') }}</h4>
              <div class="cert-meta">
                <span class="cert-date">{{ formatItemDate(cert, 'date') }}</span>
                <span *ngIf="hasItemProperty(cert, 'credentialId')" class="cert-id">ID: {{ getItemProperty(cert, 'credentialId') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Section -->
        <div *ngSwitchCase="'projects'" class="projects-content">
          <div *ngFor="let project of getDataArray('projects')" class="project-item">
            <div class="project-header">
              <h3 class="project-name">{{ getItemProperty(project, 'name') }}</h3>
              <a *ngIf="hasItemProperty(project, 'url')" [href]="getItemProperty(project, 'url')" target="_blank" class="project-link">
                View Project →
              </a>
            </div>

            <div class="project-content">
              <p *ngIf="hasItemProperty(project, 'description')" class="project-description">{{ getItemProperty(project, 'description') }}</p>

              <div *ngIf="hasItemArrayWithLength(project, 'technologies')" class="project-technologies">
                <h5>Technologies:</h5>
                <app-dynamic-field
                  [field]="{key: 'technologies', label: 'Technologies', type: 'list', visible: true}"
                  [value]="getItemProperty(project, 'technologies')">
                </app-dynamic-field>
              </div>
            </div>
          </div>
        </div>

        <!-- Default/Unknown Section -->
        <div *ngSwitchDefault class="unknown-section">
          <pre>{{ data | json }}</pre>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .cv-section {
      margin-bottom: 2rem;
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }

    .section-icon {
      font-size: 1.25rem;
    }

    /* Personal Info Styles */
    .personal-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .person-name {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .person-title {
      font-size: 1.5rem;
      font-weight: 400;
      color: #6b7280;
      margin: 0 0 1rem 0;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
    }

    .summary {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #3b82f6;
    }

    .summary p {
      margin: 0;
      line-height: 1.6;
      color: #374151;
    }

    /* Experience Styles */
    .job-item {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .job-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .job-header {
      margin-bottom: 1rem;
    }

    .job-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .job-company {
      font-size: 1.1rem;
      font-weight: 500;
      color: #3b82f6;
      margin: 0 0 0.5rem 0;
    }

    .job-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .job-description {
      margin: 0 0 1rem 0;
      line-height: 1.6;
      color: #374151;
    }

    .achievements h5, .technologies h5 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .achievements ul {
      margin: 0;
      padding-left: 1.25rem;
    }

    .achievements li {
      margin-bottom: 0.25rem;
      line-height: 1.5;
      color: #374151;
    }

    /* Education Styles */
    .degree-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .degree-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .degree-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .degree-institution {
      font-size: 1rem;
      font-weight: 500;
      color: #3b82f6;
      margin: 0 0 0.5rem 0;
    }

    .degree-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .relevant-courses h5 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Skills Styles */
    .skill-category {
      margin-bottom: 1.5rem;
    }

    .category-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    /* Certifications Styles */
    .certification-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .certification-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .cert-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .cert-issuer {
      font-size: 1rem;
      font-weight: 500;
      color: #3b82f6;
      margin: 0 0 0.5rem 0;
    }

    .cert-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* Projects Styles */
    .project-item {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .project-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .project-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .project-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .project-link:hover {
      text-decoration: underline;
    }

    .project-description {
      margin: 0 0 1rem 0;
      line-height: 1.6;
      color: #374151;
    }

    .project-technologies h5 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Unknown section fallback */
    .unknown-section pre {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 0.375rem;
      overflow-x: auto;
      font-size: 0.875rem;
    }
  `]
})
export class DynamicSectionComponent {
  @Input() sectionConfig!: SectionConfig;
  @Input() data: unknown;

  private dynamicRenderer = inject(DynamicRendererService);

  // Helper methods to safely access data properties
  getDataProperty(key: string): unknown {
    if (typeof this.data === 'object' && this.data !== null) {
      return (this.data as Record<string, unknown>)[key];
    }
    return undefined;
  }

  hasDataProperty(key: string): boolean {
    if (typeof this.data === 'object' && this.data !== null) {
      const obj = this.data as Record<string, unknown>;
      return obj[key] !== undefined && obj[key] !== null;
    }
    return false;
  }

  getDataArray(key: string): unknown[] {
    const value = this.getDataProperty(key);
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  }

  // Helper methods to safely access properties of array items
  getItemProperty(item: unknown, key: string): unknown {
    if (typeof item === 'object' && item !== null) {
      return (item as Record<string, unknown>)[key];
    }
    return undefined;
  }

  hasItemProperty(item: unknown, key: string): boolean {
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      return obj[key] !== undefined && obj[key] !== null;
    }
    return false;
  }

  getItemArray(item: unknown, key: string): unknown[] {
    const value = this.getItemProperty(item, key);
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  }

  hasItemArrayWithLength(item: unknown, key: string): boolean {
    const array = this.getItemArray(item, key);
    return array.length > 0;
  }

  // Helper method to safely format dates from unknown values
  formatItemDate(item: unknown, key: string): string {
    const value = this.getItemProperty(item, key);
    return this.formatDate(String(value || ''));
  }

  getSectionIcon(): string {
    const iconMap: Record<string, string> = {
      'personalInfo': '👤',
      'experience': '💼',
      'education': '🎓',
      'skills': '⚡',
      'certifications': '🏆',
      'projects': '📁'
    };
    return iconMap[this.sectionConfig.key] || '📄';
  }

  getPersonalInfoFields(): FieldConfig[] {
    return this.dynamicRenderer.getPersonalInfoFields(this.data as PersonalInfo)
      .filter(field => field.key !== 'name' && field.key !== 'title' && field.key !== 'summary');
  }

  formatDate(dateStr: string): string {
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
