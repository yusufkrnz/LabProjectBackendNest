import { Injectable } from '@nestjs/common';

export interface TechStackMatch {
  matched: string[];
  notFound: string[];
  additionalTechnologies: string[];
}

export interface TechStackSummary {
  allFrameworks: string[];
  allDatabases: string[];
  allTools: string[];
  allLibraries: string[];
  allLanguages: string[];
}

@Injectable()
export class TechStackMatcherService {
  /**
   * Verify user's claimed technologies against actual GitHub usage
   */
  verifyTechStack(
    repositories: any[],
    claimedTechnologies: string[],
  ): TechStackMatch {
    // Collect all technologies from all repositories
    const allTechs = this.collectAllTechnologies(repositories);

    // Normalize for case-insensitive matching
    const allTechsLower = new Set(allTechs.map((t) => t.toLowerCase()));

    const matched: string[] = [];
    const notFound: string[] = [];

    // Check each claimed technology
    claimedTechnologies.forEach((claimed) => {
      const claimedLower = claimed.toLowerCase();

      // Check for exact or partial match
      const isMatch = Array.from(allTechsLower).some(
        (tech) =>
          tech === claimedLower ||
          tech.includes(claimedLower) ||
          claimedLower.includes(tech),
      );

      if (isMatch) {
        matched.push(claimed);
      } else {
        notFound.push(claimed);
      }
    });

    // Find additional technologies not claimed
    const claimedLower = new Set(
      claimedTechnologies.map((t) => t.toLowerCase()),
    );
    const additional = allTechs.filter(
      (tech) =>
        !Array.from(claimedLower).some(
          (claimed) =>
            tech.toLowerCase() === claimed ||
            tech.toLowerCase().includes(claimed) ||
            claimed.includes(tech.toLowerCase()),
        ),
    );

    return {
      matched,
      notFound,
      additionalTechnologies: additional,
    };
  }

  /**
   * Generate comprehensive tech stack summary from all repositories
   */
  generateTechStackSummary(repositories: any[]): TechStackSummary {
    const frameworks = new Set<string>();
    const databases = new Set<string>();
    const tools = new Set<string>();
    const libraries = new Set<string>();
    const languages = new Set<string>();

    repositories.forEach((repo) => {
      // Add detected technologies
      repo.detectedFrameworks?.forEach((f: string) => frameworks.add(f));
      repo.detectedDatabases?.forEach((d: string) => databases.add(d));
      repo.detectedTools?.forEach((t: string) => tools.add(t));
      repo.detectedLibraries?.forEach((l: string) => libraries.add(l));

      // Add languages
      if (repo.primaryLanguage?.name) {
        languages.add(repo.primaryLanguage.name);
      }
      repo.languages?.forEach((lang: any) => languages.add(lang.name));
    });

    return {
      allFrameworks: Array.from(frameworks).sort(),
      allDatabases: Array.from(databases).sort(),
      allTools: Array.from(tools).sort(),
      allLibraries: Array.from(libraries).sort(),
      allLanguages: Array.from(languages).sort(),
    };
  }

  /**
   * Collect all unique technologies from repositories
   */
  private collectAllTechnologies(repositories: any[]): string[] {
    const allTechs = new Set<string>();

    repositories.forEach((repo) => {
      // Add all detected technologies
      repo.detectedFrameworks?.forEach((t: string) => allTechs.add(t));
      repo.detectedDatabases?.forEach((t: string) => allTechs.add(t));
      repo.detectedTools?.forEach((t: string) => allTechs.add(t));
      repo.detectedLibraries?.forEach((t: string) => allTechs.add(t));

      // Add languages
      if (repo.primaryLanguage?.name) {
        allTechs.add(repo.primaryLanguage.name);
      }
      repo.languages?.forEach((lang: any) => allTechs.add(lang.name));
    });

    return Array.from(allTechs);
  }

  /**
   * Get technologies by category
   */
  getTechnologiesByCategory(repositories: any[]): {
    frontend: string[];
    backend: string[];
    database: string[];
    devops: string[];
    mobile: string[];
  } {
    const summary = this.generateTechStackSummary(repositories);

    // Categorize frameworks
    const frontendFrameworks = [
      'React',
      'Vue.js',
      'Angular',
      'Svelte',
      'Next.js',
      'Nuxt.js',
      'Vite',
    ];
    const backendFrameworks = [
      'Express.js',
      'NestJS',
      'Django',
      'Flask',
      'FastAPI',
      'Spring Boot',
      'Ruby on Rails',
      'Gin',
      'Gorilla Mux',
    ];
    const mobileFrameworks = ['React Native', 'Flutter', 'Ionic'];

    const frontend = [
      ...summary.allFrameworks.filter((f) => frontendFrameworks.includes(f)),
      ...summary.allLanguages.filter((l) =>
        ['JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(l),
      ),
    ];

    const backend = [
      ...summary.allFrameworks.filter((f) => backendFrameworks.includes(f)),
      ...summary.allLanguages.filter((l) =>
        ['Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', 'Rust'].includes(l),
      ),
    ];

    const mobile = [
      ...summary.allFrameworks.filter((f) => mobileFrameworks.includes(f)),
      ...summary.allLanguages.filter((l) =>
        ['Swift', 'Kotlin', 'Dart'].includes(l),
      ),
    ];

    return {
      frontend: [...new Set(frontend)],
      backend: [...new Set(backend)],
      database: summary.allDatabases,
      devops: summary.allTools,
      mobile: [...new Set(mobile)],
    };
  }
}
