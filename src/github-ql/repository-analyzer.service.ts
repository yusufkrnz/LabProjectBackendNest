import { Injectable } from '@nestjs/common';

export interface RepositoryCategory {
  category:
    | 'frontend'
    | 'backend'
    | 'mobile'
    | 'fullstack'
    | 'devops'
    | 'data-science'
    | 'other';
  confidence: number; // 0-100
  technologies: string[];
  frameworks: string[];
}

@Injectable()
export class RepositoryAnalyzer {
  /**
   * Analyze repository and categorize by tech stack
   */
  analyzeRepository(repo: any): RepositoryCategory {
    const languages = repo.languages || [];
    const topics = repo.topics || [];
    const description = (repo.description || '').toLowerCase();
    const name = repo.name.toLowerCase();

    // Extract language names
    const languageNames = languages.map((l: any) => l.name.toLowerCase());
    const allText = [...languageNames, ...topics, description, name].join(' ');

    // Detect technologies
    const detectedTechs = this.detectTechnologies(allText, languages);

    // Categorize
    const category = this.categorizeRepository(detectedTechs, languages);

    return category;
  }

  /**
   * Detect specific technologies and frameworks
   */
  private detectTechnologies(
    text: string,
    languages: any[],
  ): {
    frontend: string[];
    backend: string[];
    mobile: string[];
    devops: string[];
    dataScience: string[];
  } {
    const detected = {
      frontend: [] as string[],
      backend: [] as string[],
      mobile: [] as string[],
      devops: [] as string[],
      dataScience: [] as string[],
    };

    // Frontend detection
    const frontendTechs = {
      react: 'React',
      vue: 'Vue.js',
      angular: 'Angular',
      next: 'Next.js',
      nuxt: 'Nuxt.js',
      svelte: 'Svelte',
      tailwind: 'Tailwind CSS',
      bootstrap: 'Bootstrap',
      sass: 'SASS',
      webpack: 'Webpack',
      vite: 'Vite',
    };

    // Backend detection
    const backendTechs = {
      node: 'Node.js',
      express: 'Express.js',
      nestjs: 'NestJS',
      django: 'Django',
      flask: 'Flask',
      fastapi: 'FastAPI',
      spring: 'Spring Boot',
      laravel: 'Laravel',
      rails: 'Ruby on Rails',
      graphql: 'GraphQL',
      mongodb: 'MongoDB',
      postgresql: 'PostgreSQL',
      mysql: 'MySQL',
      redis: 'Redis',
    };

    // Mobile detection
    const mobileTechs = {
      'react native': 'React Native',
      flutter: 'Flutter',
      swift: 'Swift',
      kotlin: 'Kotlin',
      android: 'Android',
      ios: 'iOS',
      expo: 'Expo',
    };

    // DevOps detection
    const devopsTechs = {
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      jenkins: 'Jenkins',
      'github actions': 'GitHub Actions',
      terraform: 'Terraform',
      ansible: 'Ansible',
      'ci/cd': 'CI/CD',
    };

    // Data Science detection
    const dataScienceTechs = {
      jupyter: 'Jupyter',
      pandas: 'Pandas',
      numpy: 'NumPy',
      tensorflow: 'TensorFlow',
      pytorch: 'PyTorch',
      scikit: 'Scikit-learn',
      'machine learning': 'Machine Learning',
      'data science': 'Data Science',
    };

    // Check all technologies
    Object.entries(frontendTechs).forEach(([key, value]) => {
      if (text.includes(key)) detected.frontend.push(value);
    });

    Object.entries(backendTechs).forEach(([key, value]) => {
      if (text.includes(key)) detected.backend.push(value);
    });

    Object.entries(mobileTechs).forEach(([key, value]) => {
      if (text.includes(key)) detected.mobile.push(value);
    });

    Object.entries(devopsTechs).forEach(([key, value]) => {
      if (text.includes(key)) detected.devops.push(value);
    });

    Object.entries(dataScienceTechs).forEach(([key, value]) => {
      if (text.includes(key)) detected.dataScience.push(value);
    });

    // Language-based detection
    languages.forEach((lang: any) => {
      const langName = lang.name.toLowerCase();

      // Frontend languages
      if (['javascript', 'typescript', 'html', 'css'].includes(langName)) {
        if (!detected.frontend.includes(lang.name)) {
          detected.frontend.push(lang.name);
        }
      }

      // Backend languages
      if (
        ['python', 'java', 'go', 'rust', 'c#', 'php', 'ruby'].includes(langName)
      ) {
        if (!detected.backend.includes(lang.name)) {
          detected.backend.push(lang.name);
        }
      }

      // Mobile languages
      if (['swift', 'kotlin', 'dart', 'objective-c'].includes(langName)) {
        if (!detected.mobile.includes(lang.name)) {
          detected.mobile.push(lang.name);
        }
      }

      // Data Science
      if (langName === 'jupyter notebook') {
        detected.dataScience.push('Jupyter Notebook');
      }
    });

    return detected;
  }

  /**
   * Categorize repository based on detected technologies
   */
  private categorizeRepository(
    techs: ReturnType<typeof this.detectTechnologies>,
    languages: any[],
  ): RepositoryCategory {
    const scores = {
      frontend: techs.frontend.length,
      backend: techs.backend.length,
      mobile: techs.mobile.length,
      devops: techs.devops.length,
      dataScience: techs.dataScience.length,
    };

    // Fullstack detection
    if (scores.frontend > 0 && scores.backend > 0) {
      return {
        category: 'fullstack',
        confidence: 90,
        technologies: [...techs.frontend, ...techs.backend],
        frameworks: this.extractFrameworks([
          ...techs.frontend,
          ...techs.backend,
        ]),
      };
    }

    // Mobile detection
    if (scores.mobile > 0) {
      return {
        category: 'mobile',
        confidence: 85,
        technologies: techs.mobile,
        frameworks: this.extractFrameworks(techs.mobile),
      };
    }

    // Frontend detection
    if (scores.frontend > scores.backend && scores.frontend > 0) {
      return {
        category: 'frontend',
        confidence: 80,
        technologies: techs.frontend,
        frameworks: this.extractFrameworks(techs.frontend),
      };
    }

    // Backend detection
    if (scores.backend > 0) {
      return {
        category: 'backend',
        confidence: 80,
        technologies: techs.backend,
        frameworks: this.extractFrameworks(techs.backend),
      };
    }

    // DevOps detection
    if (scores.devops > 0) {
      return {
        category: 'devops',
        confidence: 75,
        technologies: techs.devops,
        frameworks: [],
      };
    }

    // Data Science detection
    if (scores.dataScience > 0) {
      return {
        category: 'data-science',
        confidence: 75,
        technologies: techs.dataScience,
        frameworks: this.extractFrameworks(techs.dataScience),
      };
    }

    // Default to other
    return {
      category: 'other',
      confidence: 50,
      technologies: languages.map((l: any) => l.name),
      frameworks: [],
    };
  }

  /**
   * Extract framework names from technologies
   */
  private extractFrameworks(technologies: string[]): string[] {
    const frameworks = [
      'React',
      'Vue.js',
      'Angular',
      'Next.js',
      'Nuxt.js',
      'Svelte',
      'Express.js',
      'NestJS',
      'Django',
      'Flask',
      'FastAPI',
      'Spring Boot',
      'Laravel',
      'Ruby on Rails',
      'React Native',
      'Flutter',
    ];

    return technologies.filter((tech) => frameworks.includes(tech));
  }

  /**
   * Analyze all repositories and group by category
   */
  analyzeAllRepositories(repositories: any[]): {
    summary: {
      totalRepos: number;
      frontend: number;
      backend: number;
      mobile: number;
      fullstack: number;
      devops: number;
      dataScience: number;
      other: number;
    };
    categorized: {
      frontend: any[];
      backend: any[];
      mobile: any[];
      fullstack: any[];
      devops: any[];
      dataScience: any[];
      other: any[];
    };
    topTechnologies: { name: string; count: number }[];
    topFrameworks: { name: string; count: number }[];
  } {
    const categorized = {
      frontend: [] as any[],
      backend: [] as any[],
      mobile: [] as any[],
      fullstack: [] as any[],
      devops: [] as any[],
      dataScience: [] as any[],
      other: [] as any[],
    };

    const allTechnologies = new Map<string, number>();
    const allFrameworks = new Map<string, number>();

    repositories.forEach((repo) => {
      const analysis = this.analyzeRepository(repo);

      // Add to category
      const categoryKey =
        analysis.category === 'data-science'
          ? 'dataScience'
          : analysis.category;
      categorized[categoryKey].push({
        ...repo,
        analysis,
      });

      // Count technologies
      analysis.technologies.forEach((tech) => {
        allTechnologies.set(tech, (allTechnologies.get(tech) || 0) + 1);
      });

      // Count frameworks
      analysis.frameworks.forEach((framework) => {
        allFrameworks.set(framework, (allFrameworks.get(framework) || 0) + 1);
      });
    });

    // Sort technologies and frameworks by count
    const topTechnologies = Array.from(allTechnologies.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topFrameworks = Array.from(allFrameworks.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      summary: {
        totalRepos: repositories.length,
        frontend: categorized.frontend.length,
        backend: categorized.backend.length,
        mobile: categorized.mobile.length,
        fullstack: categorized.fullstack.length,
        devops: categorized.devops.length,
        dataScience: categorized.dataScience.length,
        other: categorized.other.length,
      },
      categorized,
      topTechnologies,
      topFrameworks,
    };
  }
}
