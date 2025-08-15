import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field';
import { SectionConfig, FieldConfig, DynamicRendererService } from '../../services/dynamic-renderer.service';

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
            <h1 *ngIf="data.name" class="person-name">{{ data.name }}</h1>
            <h2 *ngIf="data.title" class="person-title">{{ data.title }}</h2>
          </div>
          
          <div class="contact-info">
            <div *ngFor="let field of getPersonalInfoFields()" class="contact-item">
              <app-dynamic-field 
                [field]="field" 
                [value]="data[field.key]">
              </app-dynamic-field>
            </div>
          </div>
          
          <div *ngIf="data.summary" class="summary">
            <p>{{ data.summary }}</p>
          </div>
        </div>

        <!-- Experience Section -->
        <div *ngSwitchCase="'experience'" class="experience-content">
          <div *ngFor="let job of data.jobs" class="job-item">
            <div class="job-header">
              <h3 class="job-title">{{ job.position }}</h3>
              <h4 class="job-company">{{ job.company }}</h4>
              <div class="job-meta">
                <span class="job-dates">
                  {{ formatDate(job.startDate) }} - {{ formatDate(job.endDate) }}
                </span>
                <span *ngIf="job.location" class="job-location">{{ job.location }}</span>
              </div>
            </div>
            
            <div class="job-content">
              <p *ngIf="job.description" class="job-description">{{ job.description }}</p>
              
              <div *ngIf="job.achievements?.length > 0" class="achievements">
                <h5>Key Achievements:</h5>
                <ul>
                  <li *ngFor="let achievement of job.achievements">{{ achievement.text }}</li>
                </ul>
              </div>
              
              <div *ngIf="job.technologies?.length > 0" class="technologies">
                <h5>Technologies Used:</h5>
                <app-dynamic-field 
                  [field]="{key: 'technologies', label: 'Technologies', type: 'list', visible: true}"
                  [value]="job.technologies">
                </app-dynamic-field>
              </div>
            </div>
          </div>
        </div>

        <!-- Education Section -->
        <div *ngSwitchCase="'education'" class="education-content">
          <div *ngFor="let degree of data.degrees" class="degree-item">
            <div class="degree-header">
              <h3 class="degree-title">{{ degree.degree }}</h3>
              <h4 class="degree-institution">{{ degree.institution }}</h4>
              <div class="degree-meta">
                <span class="degree-dates">
                  {{ formatDate(degree.startDate) }} - {{ formatDate(degree.endDate) }}
                </span>
                <span *ngIf="degree.gpa" class="degree-gpa">GPA: {{ degree.gpa }}</span>
                <span *ngIf="degree.honors" class="degree-honors">{{ degree.honors }}</span>
              </div>
            </div>
            
            <div *ngIf="degree.relevantCourses?.length > 0" class="relevant-courses">
              <h5>Relevant Courses:</h5>
              <app-dynamic-field 
                [field]="{key: 'relevantCourses', label: 'Courses', type: 'list', visible: true}"
                [value]="degree.relevantCourses">
              </app-dynamic-field>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div *ngSwitchCase="'skills'" class="skills-content">
          <div *ngFor="let category of data.categories" class="skill-category">
            <h3 class="category-title">{{ category.name }}</h3>
            <div class="skills-list">
              <app-dynamic-field 
                [field]="{key: 'skills', label: 'Skills', type: 'array', visible: true}"
                [value]="category.skills">
              </app-dynamic-field>
            </div>
          </div>
        </div>

        <!-- Certifications Section -->
        <div *ngSwitchCase="'certifications'" class="certifications-content">
          <div *ngFor="let cert of data.certifications" class="certification-item">
            <div class="cert-header">
              <h3 class="cert-name">{{ cert.name }}</h3>
              <h4 class="cert-issuer">{{ cert.issuer }}</h4>
              <div class="cert-meta">
                <span class="cert-date">{{ formatDate(cert.date) }}</span>
                <span *ngIf="cert.credentialId" class="cert-id">ID: {{ cert.credentialId }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Section -->
        <div *ngSwitchCase="'projects'" class="projects-content">
          <div *ngFor="let project of data.projects" class="project-item">
            <div class="project-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <a *ngIf="project.url" [href]="project.url" target="_blank" class="project-link">
                View Project →
              </a>
            </div>
            
            <div class="project-content">
              <p *ngIf="project.description" class="project-description">{{ project.description }}</p>
              
              <div *ngIf="project.technologies?.length > 0" class="project-technologies">
                <h5>Technologies:</h5>
                <app-dynamic-field 
                  [field]="{key: 'technologies', label: 'Technologies', type: 'list', visible: true}"
                  [value]="project.technologies">
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
  @Input() data: any;

  constructor(private dynamicRenderer: DynamicRendererService) {}

  getSectionIcon(): string {
    const iconMap: { [key: string]: string } = {
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
    return this.dynamicRenderer.getPersonalInfoFields(this.data)
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
