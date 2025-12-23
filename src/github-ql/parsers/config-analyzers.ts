import { Injectable } from '@nestjs/common';
import { TechStackResult } from './dependency-parsers';

/**
 * Config file analyzers following Strategy Pattern
 */
export interface IConfigAnalyzer {
  analyze(repo: any): Partial<TechStackResult>;
}

/**
 * Framework Config Analyzer
 */
@Injectable()
export class FrameworkConfigAnalyzer implements IConfigAnalyzer {
  private readonly configMap: Record<string, string> = {
    nextConfig: 'Next.js',
    viteConfig: 'Vite',
    angularJson: 'Angular',
    vueConfig: 'Vue.js',
    nuxtConfig: 'Nuxt.js',
  };

  analyze(repo: any): Partial<TechStackResult> {
    const frameworks = new Set<string>();

    Object.entries(this.configMap).forEach(([configKey, frameworkName]) => {
      if (repo[configKey]?.text) {
        frameworks.add(frameworkName);
      }
    });

    return { frameworks };
  }
}

/**
 * ORM/Database Schema Analyzer
 */
@Injectable()
export class ORMSchemaAnalyzer implements IConfigAnalyzer {
  analyze(repo: any): Partial<TechStackResult> {
    const databases = new Set<string>();
    const libraries = new Set<string>();

    // Prisma Schema
    if (repo.prismaSchema?.text) {
      libraries.add('Prisma');

      const providerMap: Record<string, string> = {
        postgresql: 'PostgreSQL',
        mysql: 'MySQL',
        mongodb: 'MongoDB',
        sqlite: 'SQLite',
      };

      Object.entries(providerMap).forEach(([provider, dbName]) => {
        if (repo.prismaSchema.text.includes(`provider = "${provider}"`)) {
          databases.add(dbName);
        }
      });
    }

    // TypeORM Config
    if (repo.typeormConfig?.text) {
      libraries.add('TypeORM');
      try {
        const config = JSON.parse(repo.typeormConfig.text);
        const typeMap: Record<string, string> = {
          postgres: 'PostgreSQL',
          mysql: 'MySQL',
          mongodb: 'MongoDB',
        };

        if (config.type && typeMap[config.type]) {
          databases.add(typeMap[config.type]);
        }
      } catch (e) {
        // Invalid JSON
      }
    }

    return { databases, libraries };
  }
}

/**
 * DevOps Tools Analyzer
 */
@Injectable()
export class DevOpsAnalyzer implements IConfigAnalyzer {
  analyze(repo: any): Partial<TechStackResult> {
    const tools = new Set<string>();
    const databases = new Set<string>();

    // Docker
    if (repo.dockerfile?.text) {
      tools.add('Docker');
    }

    // Docker Compose
    if (repo.dockerCompose?.text) {
      tools.add('Docker Compose');

      // Detect databases from docker-compose
      const imageMap: Record<string, string> = {
        postgres: 'PostgreSQL',
        mongo: 'MongoDB',
        mysql: 'MySQL',
        redis: 'Redis',
      };

      Object.entries(imageMap).forEach(([image, dbName]) => {
        if (repo.dockerCompose.text.includes(`image: ${image}`)) {
          databases.add(dbName);
        }
      });
    }

    // CI/CD
    if (repo.githubActions?.text) {
      tools.add('GitHub Actions');
    }
    if (repo.gitlabCI?.text) {
      tools.add('GitLab CI');
    }

    return { tools, databases };
  }
}

/**
 * README Analyzer
 */
@Injectable()
export class ReadmeAnalyzer implements IConfigAnalyzer {
  private readonly frameworkKeywords: Record<string, string> = {
    react: 'React',
    vue: 'Vue.js',
    angular: 'Angular',
    django: 'Django',
    flask: 'Flask',
    'spring boot': 'Spring Boot',
  };

  private readonly databaseKeywords: Record<string, string> = {
    postgresql: 'PostgreSQL',
    postgres: 'PostgreSQL',
    mongodb: 'MongoDB',
    mongo: 'MongoDB',
    mysql: 'MySQL',
    redis: 'Redis',
  };

  analyze(repo: any): Partial<TechStackResult> {
    const frameworks = new Set<string>();
    const databases = new Set<string>();

    if (!repo.readme?.text) {
      return { frameworks, databases };
    }

    const readmeLower = repo.readme.text.toLowerCase();

    Object.entries(this.frameworkKeywords).forEach(([keyword, name]) => {
      if (readmeLower.includes(keyword)) {
        frameworks.add(name);
      }
    });

    Object.entries(this.databaseKeywords).forEach(([keyword, name]) => {
      if (readmeLower.includes(keyword)) {
        databases.add(name);
      }
    });

    return { frameworks, databases };
  }
}
