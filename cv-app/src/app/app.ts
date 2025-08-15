import { Component, signal } from '@angular/core';
import { Cv } from './components/cv/cv';

@Component({
  selector: 'app-root',
  imports: [Cv],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cv-app');
}
