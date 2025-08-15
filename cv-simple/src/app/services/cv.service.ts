import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { 
  CV, 
  PersonalInfo, 
  Experience, 
  Job, 
  Education, 
  Degree, 
  Skills, 
  SkillCategory, 
  Skill,
  Certifications,
  Certification,
  Projects,
  Project,
  Achievement,
  Technology,
  Course
} from '../models/cv.models';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  constructor(private http: HttpClient) { }

  getCvData(): Observable<CV> {
    // Temporary: Return hardcoded data to test component rendering
    const testData: CV = {
      personalInfo: {
        name: 'Bo Johnson',
        title: 'Senior Software Engineer',
        email: 'bo.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        summary: 'Experienced software engineer with 8+ years of expertise.'
      },
      experience: {
        jobs: [{
          company: 'TechCorp Inc.',
          position: 'Senior Software Engineer',
          startDate: '2021-03',
          endDate: 'Present',
          location: 'San Francisco, CA',
          description: 'Lead development of microservices architecture.',
          achievements: [{ text: 'Reduced system latency by 40%' }],
          technologies: [{ name: 'React' }, { name: 'Node.js' }]
        }]
      },
      education: {
        degrees: [{
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Science',
          startDate: '2013-09',
          endDate: '2017-05',
          gpa: '3.8',
          honors: 'Magna Cum Laude',
          relevantCourses: [{ name: 'Data Structures' }]
        }]
      },
      skills: {
        categories: [{
          name: 'Programming Languages',
          skills: [{ name: 'JavaScript', level: 'Expert' }]
        }]
      },
      certifications: { certifications: [] },
      projects: { projects: [] }
    };

    return of(testData);

    // Original XML loading code (commented out for testing)
    /*
    return this.http.get('/cv-data.xml', { responseType: 'text' })
      .pipe(
        map(xmlString => this.parseXmlToCv(xmlString))
      );
    */
  }

  private parseXmlToCv(xmlString: string): CV {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check for XML parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      throw new Error('Failed to parse XML: ' + parserError.textContent);
    }

    console.log('XML parsed successfully');
    console.log('Root element:', xmlDoc.documentElement.tagName);
    console.log('Root children:', Array.from(xmlDoc.documentElement.children).map(child => child.tagName));
    
    try {
      const personalInfo = this.parsePersonalInfo(xmlDoc);
      console.log('Personal info parsed successfully');

      const experience = this.parseExperience(xmlDoc);
      console.log('Experience parsed successfully');

      const education = this.parseEducation(xmlDoc);
      console.log('Education parsed successfully');

      const skills = this.parseSkills(xmlDoc);
      console.log('Skills parsed successfully');

      const certifications = this.parseCertifications(xmlDoc);
      console.log('Certifications parsed successfully');

      const projects = this.parseProjects(xmlDoc);
      console.log('Projects parsed successfully');

      return {
        personalInfo,
        experience,
        education,
        skills,
        certifications,
        projects
      };
    } catch (error) {
      console.error('Error during parsing:', error);
      throw error;
    }
  }

  private parsePersonalInfo(xmlDoc: Document): PersonalInfo {
    const personalInfoNode = xmlDoc.querySelector('personalInfo');
    if (!personalInfoNode) throw new Error('Personal info not found');

    return {
      name: this.getTextContent(personalInfoNode, 'name'),
      title: this.getTextContent(personalInfoNode, 'title'),
      email: this.getTextContent(personalInfoNode, 'email'),
      phone: this.getTextContent(personalInfoNode, 'phone'),
      location: this.getTextContent(personalInfoNode, 'location'),
      linkedin: this.getOptionalTextContent(personalInfoNode, 'linkedin'),
      github: this.getOptionalTextContent(personalInfoNode, 'github'),
      website: this.getOptionalTextContent(personalInfoNode, 'website'),
      summary: this.getTextContent(personalInfoNode, 'summary').trim()
    };
  }

  private parseExperience(xmlDoc: Document): Experience {
    const experienceNode = xmlDoc.querySelector('experience');
    if (!experienceNode) throw new Error('Experience not found');

    const jobNodes = experienceNode.querySelectorAll('job');
    const jobs: Job[] = Array.from(jobNodes).map(jobNode => ({
      company: this.getTextContent(jobNode, 'company'),
      position: this.getTextContent(jobNode, 'position'),
      startDate: this.getTextContent(jobNode, 'startDate'),
      endDate: this.getTextContent(jobNode, 'endDate'),
      location: this.getTextContent(jobNode, 'location'),
      description: this.getTextContent(jobNode, 'description').trim(),
      achievements: this.parseAchievements(jobNode),
      technologies: this.parseTechnologies(jobNode)
    }));

    return { jobs };
  }

  private parseAchievements(jobNode: Element): Achievement[] {
    const achievementsNode = jobNode.querySelector('achievements');
    if (!achievementsNode) return [];

    const achievementNodes = achievementsNode.querySelectorAll('achievement');
    return Array.from(achievementNodes).map(node => ({
      text: node.textContent?.trim() || ''
    }));
  }

  private parseTechnologies(parentNode: Element): Technology[] {
    const technologiesNode = parentNode.querySelector('technologies');
    if (!technologiesNode) return [];

    const techNodes = technologiesNode.querySelectorAll('tech');
    return Array.from(techNodes).map(node => ({
      name: node.textContent?.trim() || ''
    }));
  }

  private parseEducation(xmlDoc: Document): Education {
    const educationNode = xmlDoc.querySelector('education');
    if (!educationNode) throw new Error('Education not found');

    const degreeNodes = educationNode.querySelectorAll('degree');
    console.log('Found degree nodes:', degreeNodes.length);

    const degrees: Degree[] = Array.from(degreeNodes).map((degreeNode, index) => {
      console.log(`Processing degree ${index}:`, degreeNode);
      console.log('Degree node children:', Array.from(degreeNode.children).map(child => child.tagName));
      console.log('Degree node innerHTML:', degreeNode.innerHTML);

      // Check if institution element exists
      const institutionElement = degreeNode.querySelector('institution');
      console.log('Institution element:', institutionElement);
      if (!institutionElement) {
        console.error('Institution element not found in degree node');
        throw new Error('Institution element not found in degree node');
      }

      return {
        institution: this.getTextContent(degreeNode, 'institution'),
        degree: this.getTextContent(degreeNode, 'degree'),
        startDate: this.getTextContent(degreeNode, 'startDate'),
        endDate: this.getTextContent(degreeNode, 'endDate'),
        gpa: this.getOptionalTextContent(degreeNode, 'gpa'),
        honors: this.getOptionalTextContent(degreeNode, 'honors'),
        relevantCourses: this.parseCourses(degreeNode)
      };
    });

    return { degrees };
  }

  private parseCourses(degreeNode: Element): Course[] {
    const coursesNode = degreeNode.querySelector('relevantCourses');
    if (!coursesNode) return [];

    const courseNodes = coursesNode.querySelectorAll('course');
    return Array.from(courseNodes).map(node => ({
      name: node.textContent?.trim() || ''
    }));
  }

  private parseSkills(xmlDoc: Document): Skills {
    const skillsNode = xmlDoc.querySelector('skills');
    if (!skillsNode) throw new Error('Skills not found');

    const categoryNodes = skillsNode.querySelectorAll('category');
    const categories: SkillCategory[] = Array.from(categoryNodes).map(categoryNode => ({
      name: categoryNode.getAttribute('name') || '',
      skills: this.parseSkillsInCategory(categoryNode)
    }));

    return { categories };
  }

  private parseSkillsInCategory(categoryNode: Element): Skill[] {
    const skillNodes = categoryNode.querySelectorAll('skill');
    return Array.from(skillNodes).map(skillNode => ({
      name: skillNode.textContent?.trim() || '',
      level: (skillNode.getAttribute('level') as Skill['level']) || 'Beginner'
    }));
  }

  private parseCertifications(xmlDoc: Document): Certifications {
    const certificationsNode = xmlDoc.querySelector('certifications');
    if (!certificationsNode) return { certifications: [] };

    const certNodes = certificationsNode.querySelectorAll('certification');
    const certifications: Certification[] = Array.from(certNodes).map(certNode => ({
      name: this.getTextContent(certNode, 'name'),
      issuer: this.getTextContent(certNode, 'issuer'),
      date: this.getTextContent(certNode, 'date'),
      credentialId: this.getOptionalTextContent(certNode, 'credentialId')
    }));

    return { certifications };
  }

  private parseProjects(xmlDoc: Document): Projects {
    const projectsNode = xmlDoc.querySelector('projects');
    if (!projectsNode) return { projects: [] };

    const projectNodes = projectsNode.querySelectorAll('project');
    const projects: Project[] = Array.from(projectNodes).map(projectNode => ({
      name: this.getTextContent(projectNode, 'name'),
      description: this.getTextContent(projectNode, 'description').trim(),
      technologies: this.parseTechnologies(projectNode),
      url: this.getOptionalTextContent(projectNode, 'url')
    }));

    return { projects };
  }

  private getTextContent(parent: Element, selector: string): string {
    const element = parent.querySelector(selector);
    if (!element) throw new Error(`Element ${selector} not found`);
    return element.textContent?.trim() || '';
  }

  private getOptionalTextContent(parent: Element, selector: string): string | undefined {
    const element = parent.querySelector(selector);
    return element?.textContent?.trim() || undefined;
  }
}
