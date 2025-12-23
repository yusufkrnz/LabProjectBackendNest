import { Injectable } from '@nestjs/common';

export interface TechStackResult {
  frameworks: Set<string>;
  databases: Set<string>;
  tools: Set<string>;
  libraries: Set<string>;
  dependencies: Set<string>;
  hasTests: boolean;
}

/**
 * Base interface for dependency file parsers
 * Following Strategy Pattern for clean, extensible code
 */
export interface IDependencyParser {
  canParse(fileContent: string | null): boolean;
  parse(fileContent: string): TechStackResult;
}

/**
 * Package.json Parser (Node.js/JavaScript)
 */
@Injectable()
export class PackageJsonParser implements IDependencyParser {
  canParse(fileContent: string | null): boolean {
    return fileContent !== null && fileContent !== undefined;
  }

  parse(fileContent: string): TechStackResult {
    const result: TechStackResult = {
      frameworks: new Set(),
      databases: new Set(),
      tools: new Set(),
      libraries: new Set(),
      dependencies: new Set(),
      hasTests: false,
    };

    try {
      const packageJson = JSON.parse(fileContent);
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      Object.keys(deps).forEach((dep) => result.dependencies.add(dep));

      // Framework detection map
      const frameworkMap: Record<string, string> = {
        react: 'React',
        next: 'Next.js',
        vue: 'Vue.js',
        '@angular/core': 'Angular',
        svelte: 'Svelte',
        express: 'Express.js',
        '@nestjs/core': 'NestJS',
        nuxt: 'Nuxt.js',
      };

      // Database detection map
      const databaseMap: Record<string, string> = {
        pg: 'PostgreSQL',
        postgres: 'PostgreSQL',
        mongodb: 'MongoDB',
        mongoose: 'MongoDB',
        mysql: 'MySQL',
        mysql2: 'MySQL',
        redis: 'Redis',
        sqlite3: 'SQLite',
      };

      // Library detection map
      const libraryMap: Record<string, string> = {
        prisma: 'Prisma',
        '@prisma/client': 'Prisma',
        typeorm: 'TypeORM',
        sequelize: 'Sequelize',
        axios: 'Axios',
        graphql: 'GraphQL',
      };

      // Test detection
      const testLibraries = ['jest', 'vitest', 'mocha', 'jasmine', 'cypress'];

      // Apply mappings
      Object.entries(deps).forEach(([dep]) => {
        if (frameworkMap[dep]) result.frameworks.add(frameworkMap[dep]);
        if (databaseMap[dep]) result.databases.add(databaseMap[dep]);
        if (libraryMap[dep]) result.libraries.add(libraryMap[dep]);
        if (testLibraries.includes(dep)) result.hasTests = true;
      });
    } catch (_e) {
      // Invalid JSON, skip
    }

    return result;
  }
}

/**
 * Requirements.txt Parser (Python)
 */
@Injectable()
export class RequirementsTxtParser implements IDependencyParser {
  canParse(fileContent: string | null): boolean {
    return fileContent !== null && fileContent !== undefined;
  }

  parse(fileContent: string): TechStackResult {
    const result: TechStackResult = {
      frameworks: new Set(),
      databases: new Set(),
      tools: new Set(),
      libraries: new Set(),
      dependencies: new Set(),
      hasTests: false,
    };

    const lines = fileContent.split('\n');

    const frameworkPatterns: Record<string, string> = {
      django: 'Django',
      flask: 'Flask',
      fastapi: 'FastAPI',
    };

    const databasePatterns: Record<string, string> = {
      psycopg2: 'PostgreSQL',
      asyncpg: 'PostgreSQL',
      pymongo: 'MongoDB',
      mysql: 'MySQL',
      redis: 'Redis',
    };

    const libraryPatterns: Record<string, string> = {
      sqlalchemy: 'SQLAlchemy',
      pandas: 'Pandas',
      numpy: 'NumPy',
    };

    lines.forEach((line) => {
      const dep = line.trim().split('==')[0].split('>=')[0].toLowerCase();
      if (!dep) return;

      result.dependencies.add(dep);

      Object.entries(frameworkPatterns).forEach(([pattern, name]) => {
        if (dep.includes(pattern)) result.frameworks.add(name);
      });

      Object.entries(databasePatterns).forEach(([pattern, name]) => {
        if (dep.includes(pattern)) result.databases.add(name);
      });

      Object.entries(libraryPatterns).forEach(([pattern, name]) => {
        if (dep.includes(pattern)) result.libraries.add(name);
      });

      if (dep.includes('pytest')) result.hasTests = true;
    });

    return result;
  }
}

/**
 * Go.mod Parser (Go)
 */
@Injectable()
export class GoModParser implements IDependencyParser {
  canParse(fileContent: string | null): boolean {
    return fileContent !== null && fileContent !== undefined;
  }

  parse(fileContent: string): TechStackResult {
    const result: TechStackResult = {
      frameworks: new Set(),
      databases: new Set(),
      tools: new Set(),
      libraries: new Set(),
      dependencies: new Set(),
      hasTests: false,
    };

    const patterns: Record<
      string,
      {
        type: keyof Omit<TechStackResult, 'dependencies' | 'hasTests'>;
        name: string;
      }
    > = {
      'gin-gonic/gin': { type: 'frameworks', name: 'Gin' },
      'gorilla/mux': { type: 'frameworks', name: 'Gorilla Mux' },
      pq: { type: 'databases', name: 'PostgreSQL' },
      'mongo-driver': { type: 'databases', name: 'MongoDB' },
      gorm: { type: 'libraries', name: 'GORM' },
    };

    Object.entries(patterns).forEach(([pattern, config]) => {
      if (fileContent.includes(pattern)) {
        result[config.type].add(config.name);
      }
    });

    return result;
  }
}

/**
 * Gemfile Parser (Ruby)
 */
@Injectable()
export class GemfileParser implements IDependencyParser {
  canParse(fileContent: string | null): boolean {
    return fileContent !== null && fileContent !== undefined;
  }

  parse(fileContent: string): TechStackResult {
    const result: TechStackResult = {
      frameworks: new Set(),
      databases: new Set(),
      tools: new Set(),
      libraries: new Set(),
      dependencies: new Set(),
      hasTests: false,
    };

    const patterns: Record<
      string,
      {
        type: keyof Omit<TechStackResult, 'dependencies' | 'hasTests'>;
        name: string;
      }
    > = {
      rails: { type: 'frameworks', name: 'Ruby on Rails' },
      sinatra: { type: 'frameworks', name: 'Sinatra' },
      pg: { type: 'databases', name: 'PostgreSQL' },
      mysql2: { type: 'databases', name: 'MySQL' },
      redis: { type: 'databases', name: 'Redis' },
    };

    Object.entries(patterns).forEach(([pattern, config]) => {
      if (fileContent.includes(pattern)) {
        result[config.type].add(config.name);
      }
    });

    return result;
  }
}

/**
 * Maven/Gradle Parser (Java)
 */
@Injectable()
export class JavaDependencyParser implements IDependencyParser {
  canParse(fileContent: string | null): boolean {
    return fileContent !== null && fileContent !== undefined;
  }

  parse(fileContent: string): TechStackResult {
    const result: TechStackResult = {
      frameworks: new Set(),
      databases: new Set(),
      tools: new Set(),
      libraries: new Set(),
      dependencies: new Set(),
      hasTests: false,
    };

    const patterns: Record<
      string,
      {
        type: keyof Omit<TechStackResult, 'dependencies' | 'hasTests'>;
        name: string;
      }
    > = {
      'spring-boot': { type: 'frameworks', name: 'Spring Boot' },
      postgresql: { type: 'databases', name: 'PostgreSQL' },
      mysql: { type: 'databases', name: 'MySQL' },
      mongodb: { type: 'databases', name: 'MongoDB' },
    };

    Object.entries(patterns).forEach(([pattern, config]) => {
      if (fileContent.includes(pattern)) {
        result[config.type].add(config.name);
      }
    });

    if (fileContent.includes('junit')) result.hasTests = true;

    return result;
  }
}
