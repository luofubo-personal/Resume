export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

export interface Achievement {
  text: string;
}

export interface Technology {
  name: string;
}

export interface Job {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  achievements: Achievement[];
  technologies: Technology[];
}

export interface Experience {
  jobs: Job[];
}

export interface Course {
  name: string;
}

export interface Degree {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  relevantCourses: Course[];
}

export interface Education {
  degrees: Degree[];
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skills {
  categories: SkillCategory[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface Certifications {
  certifications: Certification[];
}

export interface Project {
  name: string;
  description: string;
  technologies: Technology[];
  url?: string;
}

export interface Projects {
  projects: Project[];
}

export interface CV {
  personalInfo: PersonalInfo;
  experience: Experience;
  education: Education;
  skills: Skills;
  certifications: Certifications;
  projects: Projects;
}
