import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CvService } from './cv.service';

describe('CvService', () => {
  let service: CvService;
  let httpMock: HttpTestingController;

  const mockXmlData = `<?xml version="1.0" encoding="UTF-8"?>
<cv>
  <personalInfo>
    <name>John Doe</name>
    <title>Software Engineer</title>
    <email>john.doe@email.com</email>
    <phone>+1 (555) 123-4567</phone>
    <location>San Francisco, CA</location>
    <summary>Experienced software engineer.</summary>
  </personalInfo>
  <experience>
    <job>
      <company>Tech Company</company>
      <position>Senior Developer</position>
      <startDate>2020-01</startDate>
      <endDate>Present</endDate>
      <location>San Francisco, CA</location>
      <description>Lead development of web applications.</description>
      <achievements>
        <achievement>Improved performance by 50%</achievement>
      </achievements>
      <technologies>
        <tech>React</tech>
        <tech>Node.js</tech>
      </technologies>
    </job>
  </experience>
  <education>
    <degree>
      <institution>University of California</institution>
      <degree>Bachelor of Science in Computer Science</degree>
      <startDate>2015-09</startDate>
      <endDate>2019-05</endDate>
      <relevantCourses>
        <course>Data Structures</course>
      </relevantCourses>
    </degree>
  </education>
  <skills>
    <category name="Programming Languages">
      <skill level="Expert">JavaScript</skill>
    </category>
  </skills>
  <certifications>
    <certification>
      <name>AWS Certified Developer</name>
      <issuer>Amazon Web Services</issuer>
      <date>2023-01</date>
    </certification>
  </certifications>
  <projects>
    <project>
      <name>E-commerce App</name>
      <description>Full-stack e-commerce application.</description>
      <technologies>
        <tech>React</tech>
      </technologies>
    </project>
  </projects>
</cv>`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CvService]
    });
    service = TestBed.inject(CvService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and parse CV data successfully', () => {
    service.getCvData().subscribe(cv => {
      expect(cv).toBeTruthy();
      expect(cv.personalInfo.name).toBe('John Doe');
      expect(cv.personalInfo.title).toBe('Software Engineer');
      expect(cv.experience.jobs.length).toBe(1);
      expect(cv.experience.jobs[0].company).toBe('Tech Company');
      expect(cv.education.degrees.length).toBe(1);
      expect(cv.skills.categories.length).toBe(1);
      expect(cv.certifications.certifications.length).toBe(1);
      expect(cv.projects.projects.length).toBe(1);
    });

    const req = httpMock.expectOne('/cv-data.xml');
    expect(req.request.method).toBe('GET');
    req.flush(mockXmlData);
  });

  it('should handle HTTP errors', () => {
    service.getCvData().subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/cv-data.xml');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle XML parsing errors', () => {
    const invalidXml = '<invalid>xml<unclosed>';

    service.getCvData().subscribe({
      next: () => fail('should have failed with XML parsing error'),
      error: (error) => {
        expect(error.message).toContain('Failed to parse XML');
      }
    });

    const req = httpMock.expectOne('/cv-data.xml');
    req.flush(invalidXml);
  });
});
