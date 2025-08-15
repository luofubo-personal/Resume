import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvService } from '../../services/cv.service';
import { CV } from '../../models/cv.models';

@Component({
  selector: 'app-cv',
  imports: [CommonModule],
  templateUrl: './cv.html',
  styleUrl: './cv.css'
})
export class Cv implements OnInit {
  cvData: CV | null = null;
  loading = true;
  error: string | null = null;

  constructor(private cvService: CvService) {}

  ngOnInit(): void {
    this.loadCvData();
  }

  private loadCvData(): void {
    this.cvService.getCvData().subscribe({
      next: (data) => {
        this.cvData = data;
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
