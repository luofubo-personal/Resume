import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvService } from '../../services/cv.service';
import { DynamicRendererService, SectionConfig } from '../../services/dynamic-renderer.service';
import { DynamicSectionComponent } from '../dynamic-section/dynamic-section';
import { CV } from '../../models/cv.models';

@Component({
  selector: 'app-cv',
  imports: [CommonModule, DynamicSectionComponent],
  templateUrl: './cv.html',
  styleUrl: './cv.css'
})
export class Cv implements OnInit {
  cvData: CV | null = null;
  loading = true;
  error: string | null = null;
  sections: SectionConfig[] = [];

  private cvService = inject(CvService);
  private dynamicRenderer = inject(DynamicRendererService);

  ngOnInit(): void {
    this.loadCvData();
  }



  getSectionData(sectionKey: string): unknown {
    if (!this.cvData) return null;
    return (this.cvData as unknown as Record<string, unknown>)[sectionKey];
  }

  trackBySection(index: number, section: SectionConfig): string {
    return section.key;
  }

  // Make loadCvData public for retry functionality
  loadCvData(): void {
    this.loading = true;
    this.error = null;
    this.cvService.getCvData().subscribe({
      next: (data) => {
        this.cvData = data;
        this.sections = this.dynamicRenderer.getSectionConfigs(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load CV data';
        this.loading = false;
        console.error('Error loading CV data:', err);
      }
    });
  }
}
