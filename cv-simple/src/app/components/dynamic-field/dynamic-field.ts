import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldConfig } from '../../services/dynamic-renderer.service';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dynamic-field" [ngClass]="'field-' + field.type">
      <!-- Text fields -->
      <div *ngIf="field.type === 'text'" class="text-field">
        <span class="field-value">{{ value }}</span>
      </div>

      <!-- Email field -->
      <div *ngIf="field.type === 'email'" class="email-field">
        <a [href]="'mailto:' + value" class="email-link">
          <span class="field-icon">✉</span>
          {{ value }}
        </a>
      </div>

      <!-- Phone field -->
      <div *ngIf="field.type === 'phone'" class="phone-field">
        <a [href]="'tel:' + value" class="phone-link">
          <span class="field-icon">📞</span>
          {{ value }}
        </a>
      </div>

      <!-- URL field -->
      <div *ngIf="field.type === 'url'" class="url-field">
        <a [href]="value" target="_blank" rel="noopener noreferrer" class="url-link">
          <span class="field-icon" [ngSwitch]="getUrlType(value)">
            <span *ngSwitchCase="'linkedin'">💼</span>
            <span *ngSwitchCase="'github'">🔗</span>
            <span *ngSwitchDefault>🌐</span>
          </span>
          {{ getUrlDisplay(value) }}
        </a>
      </div>

      <!-- Date field -->
      <div *ngIf="field.type === 'date'" class="date-field">
        <span class="field-value">{{ formatDate(value) }}</span>
      </div>

      <!-- List field (for achievements, technologies, etc.) -->
      <div *ngIf="field.type === 'list'" class="list-field">
        <div class="list-items">
          <span *ngFor="let item of getListItems(value); let last = last" 
                class="list-item"
                [ngClass]="getListItemClass()">
            {{ getListItemText(item) }}<span *ngIf="!last" class="separator">{{ getSeparator() }}</span>
          </span>
        </div>
      </div>

      <!-- Array field (for skills with levels) -->
      <div *ngIf="field.type === 'array'" class="array-field">
        <div class="array-items">
          <span *ngFor="let item of getArrayItems(value)" 
                class="array-item skill-item"
                [ngClass]="'skill-level-' + getSkillLevel(item)">
            {{ getArrayItemText(item) }}
          </span>
        </div>
      </div>

      <!-- Object field (for complex nested data) -->
      <div *ngIf="field.type === 'object'" class="object-field">
        <div class="object-content">
          {{ getObjectDisplay(value) }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dynamic-field {
      margin-bottom: 0.5rem;
    }

    .field-value {
      color: #333;
      line-height: 1.5;
    }

    .email-link, .phone-link, .url-link {
      color: #2563eb;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s;
    }

    .email-link:hover, .phone-link:hover, .url-link:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }

    .field-icon {
      font-size: 0.9rem;
    }

    .list-field {
      margin: 0.5rem 0;
    }

    .list-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .list-item {
      display: inline-block;
    }

    .list-item.tag {
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .list-item.bullet::before {
      content: "• ";
      color: #6b7280;
      margin-right: 0.25rem;
    }

    .separator {
      color: #6b7280;
      margin: 0 0.25rem;
    }

    .array-field {
      margin: 0.5rem 0;
    }

    .array-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-item {
      background: #f3f4f6;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      color: #374151;
      border: 1px solid #d1d5db;
      position: relative;
    }

    .skill-level-expert {
      background: #dcfce7;
      border-color: #16a34a;
      color: #15803d;
    }

    .skill-level-advanced {
      background: #dbeafe;
      border-color: #2563eb;
      color: #1d4ed8;
    }

    .skill-level-intermediate {
      background: #fef3c7;
      border-color: #d97706;
      color: #b45309;
    }

    .skill-level-beginner {
      background: #fee2e2;
      border-color: #dc2626;
      color: #b91c1c;
    }

    .object-field {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .object-content {
      color: #374151;
      line-height: 1.6;
    }
  `]
})
export class DynamicFieldComponent {
  @Input() field!: FieldConfig;
  @Input() value: unknown;

  getUrlType(url: string): string {
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('github.com')) return 'github';
    return 'website';
  }

  getUrlDisplay(url: string): string {
    const type = this.getUrlType(url);
    switch (type) {
      case 'linkedin': return 'LinkedIn Profile';
      case 'github': return 'GitHub Profile';
      default: return 'Website';
    }
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

  getListItems(value: unknown): unknown[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  }

  getListItemText(item: unknown): string {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      if (obj['text']) return String(obj['text']);
      if (obj['name']) return String(obj['name']);
    }
    return String(item);
  }

  getListItemClass(): string {
    if (this.field.key === 'technologies' || this.field.key === 'relevantCourses') {
      return 'tag';
    }
    return 'bullet';
  }

  getSeparator(): string {
    if (this.field.key === 'technologies' || this.field.key === 'relevantCourses') {
      return '';
    }
    return '';
  }

  getArrayItems(value: unknown): unknown[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  }

  getArrayItemText(item: unknown): string {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      if (obj['name'] && obj['level']) return `${obj['name']}`;
      if (obj['name']) return String(obj['name']);
    }
    return String(item);
  }

  getSkillLevel(item: unknown): string {
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      if (obj['level']) {
        return String(obj['level']).toLowerCase();
      }
    }
    return 'intermediate';
  }

  getObjectDisplay(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
}
