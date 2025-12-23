import { Injectable } from '@nestjs/common';
import {
  PackageJsonParser,
  RequirementsTxtParser,
  GoModParser,
  GemfileParser,
  JavaDependencyParser,
  IDependencyParser,
  TechStackResult,
} from './parsers/dependency-parsers';
import {
  FrameworkConfigAnalyzer,
  ORMSchemaAnalyzer,
  DevOpsAnalyzer,
  ReadmeAnalyzer,
  IConfigAnalyzer,
} from './parsers/config-analyzers';

/**
 * Tech Stack Extractor Service
 * Orchestrates multiple parsers and analyzers following SOLID principles
 * Uses Strategy Pattern for extensibility
 */
@Injectable()
export class TechStackExtractorService {
  private readonly dependencyParsers: Map<string, IDependencyParser>;
  private readonly configAnalyzers: IConfigAnalyzer[];

  constructor(
    private packageJsonParser: PackageJsonParser,
    private requirementsTxtParser: RequirementsTxtParser,
    private goModParser: GoModParser,
    private gemfileParser: GemfileParser,
    private javaDependencyParser: JavaDependencyParser,
    private frameworkConfigAnalyzer: FrameworkConfigAnalyzer,
    private ormSchemaAnalyzer: ORMSchemaAnalyzer,
    private devOpsAnalyzer: DevOpsAnalyzer,
    private readmeAnalyzer: ReadmeAnalyzer,
  ) {
    // Map file keys to their parsers
    this.dependencyParsers = new Map([
      ['packageJson', packageJsonParser],
      ['requirementsTxt', requirementsTxtParser],
      ['pipfile', requirementsTxtParser], // Reuse Python parser
      ['goMod', goModParser],
      ['gemfile', gemfileParser],
      ['pomXml', javaDependencyParser],
      ['buildGradle', javaDependencyParser],
    ]);

    this.configAnalyzers = [
      frameworkConfigAnalyzer,
      ormSchemaAnalyzer,
      devOpsAnalyzer,
      readmeAnalyzer,
    ];
  }

  /**
   * Extract tech stack from repository files
   * Clean, extensible approach using Strategy Pattern
   */
  extractTechStack(repo: any): {
    frameworks: string[];
    databases: string[];
    tools: string[];
    libraries: string[];
    packageJson: any;
    dependencies: string[];
    hasDocker: boolean;
    hasCICD: boolean;
    hasTests: boolean;
    readmeContent: string;
  } {
    // Initialize aggregated result
    const aggregated: TechStackResult = {
      frameworks: new Set(),
      databases: new Set(),
      tools: new Set(),
      libraries: new Set(),
      dependencies: new Set(),
      hasTests: false,
    };

    let packageJsonData: any = null;
    let readmeContent = '';

    // Parse dependency files using strategy pattern
    this.dependencyParsers.forEach((parser, fileKey) => {
      const fileContent = repo[fileKey]?.text;
      if (parser.canParse(fileContent)) {
        const result = parser.parse(fileContent);
        this.mergeResults(aggregated, result);

        // Store package.json for later use
        if (fileKey === 'packageJson') {
          try {
            packageJsonData = JSON.parse(fileContent);
          } catch (_e) {
            // Invalid JSON
          }
        }
      }
    });

    // Analyze config files using strategy pattern
    this.configAnalyzers.forEach((analyzer) => {
      const result = analyzer.analyze(repo);
      this.mergeResults(aggregated, result);
    });

    // Extract README content
    if (repo.readme?.text) {
      readmeContent = repo.readme.text.substring(0, 5000);
    }

    // Determine DevOps flags
    const hasDocker =
      aggregated.tools.has('Docker') || aggregated.tools.has('Docker Compose');
    const hasCICD =
      aggregated.tools.has('GitHub Actions') ||
      aggregated.tools.has('GitLab CI');

    return {
      frameworks: Array.from(aggregated.frameworks),
      databases: Array.from(aggregated.databases),
      tools: Array.from(aggregated.tools),
      libraries: Array.from(aggregated.libraries),
      packageJson: packageJsonData,
      dependencies: Array.from(aggregated.dependencies),
      hasDocker,
      hasCICD,
      hasTests: aggregated.hasTests,
      readmeContent,
    };
  }

  /**
   * Merge partial results into aggregated result
   * Helper method to avoid code duplication
   */
  private mergeResults(
    target: TechStackResult,
    source: Partial<TechStackResult>,
  ): void {
    if (source.frameworks) {
      source.frameworks.forEach((f) => target.frameworks.add(f));
    }
    if (source.databases) {
      source.databases.forEach((d) => target.databases.add(d));
    }
    if (source.tools) {
      source.tools.forEach((t) => target.tools.add(t));
    }
    if (source.libraries) {
      source.libraries.forEach((l) => target.libraries.add(l));
    }
    if (source.dependencies) {
      source.dependencies.forEach((d) => target.dependencies.add(d));
    }
    if (source.hasTests) {
      target.hasTests = true;
    }
  }
}
