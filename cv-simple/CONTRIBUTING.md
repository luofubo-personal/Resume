# Contributing to Dynamic CV Generator

Thank you for your interest in contributing to the Dynamic CV Generator! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** package manager
- **Git** for version control
- Basic knowledge of **Angular**, **TypeScript**, and **XML**

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/Resume.git
   cd Resume/cv-simple
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🎯 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Edit XML with '...'
2. Navigate to '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 2.0.0]
```

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:
- **Clear description** of the enhancement
- **Use case** - why would this be useful?
- **Implementation ideas** if you have any
- **Examples** of similar features in other tools

### 🔧 Code Contributions

#### **Types of Contributions Welcome:**
- **New field types** (e.g., social media links, portfolio items)
- **Enhanced styling** and themes
- **Performance improvements**
- **Accessibility enhancements**
- **Documentation improvements**
- **Test coverage expansion**
- **Bug fixes**

#### **Development Workflow:**

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature
   
   - Detailed description of changes
   - Any breaking changes noted
   - References to issues if applicable"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**

## 📝 Code Style Guidelines

### **TypeScript/Angular**
- Use **TypeScript strict mode**
- Follow **Angular style guide**
- Use **meaningful variable names**
- Add **JSDoc comments** for public methods
- Prefer **composition over inheritance**

### **Code Formatting**
- Use **Prettier** for consistent formatting
- **2 spaces** for indentation
- **Single quotes** for strings
- **Trailing commas** where applicable

### **Component Structure**
```typescript
// Good: Clear, documented component
@Component({
  selector: 'app-dynamic-field',
  templateUrl: './dynamic-field.html',
  styleUrls: ['./dynamic-field.css']
})
export class DynamicFieldComponent {
  @Input() field!: FieldConfig;
  @Input() value: any;

  /**
   * Determines the appropriate field type based on content
   */
  getFieldType(): string {
    // Implementation
  }
}
```

### **Service Structure**
```typescript
// Good: Injectable service with clear methods
@Injectable({
  providedIn: 'root'
})
export class DynamicRendererService {
  /**
   * Generates section configurations based on CV data
   * @param cvData - The parsed CV data
   * @returns Array of section configurations
   */
  getSectionConfigs(cvData: CV): SectionConfig[] {
    // Implementation
  }
}
```

## 🧪 Testing Guidelines

### **Test Requirements**
- **Unit tests** for all new services and utilities
- **Component tests** for complex UI logic
- **Integration tests** for critical user flows
- **Maintain or improve** test coverage

### **Test Structure**
```typescript
describe('DynamicRendererService', () => {
  let service: DynamicRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicRendererService);
  });

  describe('getSectionConfigs', () => {
    it('should generate correct configurations for valid CV data', () => {
      // Arrange
      const mockCvData = { /* test data */ };
      
      // Act
      const result = service.getSectionConfigs(mockCvData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
```

## 📚 Documentation Standards

### **Code Documentation**
- **JSDoc comments** for all public methods
- **Inline comments** for complex logic
- **README updates** for new features
- **Type definitions** with clear interfaces

### **User Documentation**
- Update **README.md** for new features
- Add examples to **DEMO.md**
- Update **DYNAMIC_COMPONENTS.md** for technical changes
- Include **migration guides** for breaking changes

## 🏗️ Architecture Guidelines

### **Dynamic System Principles**
1. **Data-driven**: UI should be generated from data structure
2. **Flexible**: Support various XML structures
3. **Extensible**: Easy to add new field types and sections
4. **Performant**: Only render necessary components
5. **Accessible**: Maintain semantic HTML and ARIA support

### **Adding New Field Types**

1. **Update FieldConfig interface**
   ```typescript
   export interface FieldConfig {
     key: string;
     label: string;
     type: 'text' | 'email' | 'phone' | 'url' | 'date' | 'list' | 'array' | 'your-new-type';
     // ... other properties
   }
   ```

2. **Add detection logic**
   ```typescript
   private detectFieldType(key: string, value: any): string {
     // Add your detection logic
     if (this.isYourNewType(value)) {
       return 'your-new-type';
     }
     // ... existing logic
   }
   ```

3. **Add rendering template**
   ```html
   <div *ngSwitchCase="'your-new-type'" class="your-new-type-field">
     <!-- Your rendering logic -->
   </div>
   ```

4. **Add tests**
   ```typescript
   it('should detect your new field type correctly', () => {
     // Test implementation
   });
   ```

### **Adding New Sections**

1. **Update CV model** if needed
2. **Add section detection** in `getSectionConfigs()`
3. **Create field configuration method**
4. **Add section template** in `DynamicSectionComponent`
5. **Add appropriate styling**
6. **Write tests**

## 🚀 Release Process

### **Version Numbering**
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### **Release Checklist**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes prepared

## 🤝 Community Guidelines

### **Be Respectful**
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community

### **Be Collaborative**
- Help others learn and grow
- Share knowledge and resources
- Provide constructive feedback
- Celebrate others' contributions

## 📞 Getting Help

- **Documentation**: Check README.md, DEMO.md, and DYNAMIC_COMPONENTS.md
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: Don't hesitate to ask for feedback on your PRs

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

Thank you for contributing to making the Dynamic CV Generator better for everyone! 🚀
