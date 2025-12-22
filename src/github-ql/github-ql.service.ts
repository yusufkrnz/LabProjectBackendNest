import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { graphql } from '@octokit/graphql';
import { GithubRepository, GithubRepositoryDocument } from '../schemas/github-repository.schema';
import { UserGithubScan, UserGithubScanDocument } from '../schemas/user-github-scan.schema';
import { RepositoryAnalyzer } from './repository-analyzer.service';

@Injectable()
export class GithubQlService {
  private readonly logger = new Logger(GithubQlService.name);
  private readonly graphqlWithAuth;

  constructor(
    @InjectModel(GithubRepository.name)
    private githubRepoModel: Model<GithubRepositoryDocument>,
    @InjectModel(UserGithubScan.name)
    private userGithubScanModel: Model<UserGithubScanDocument>,
    private repositoryAnalyzer: RepositoryAnalyzer,
  ) {
    // Initialize GitHub GraphQL client with authentication
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      this.logger.warn('GITHUB_TOKEN not found in environment variables. GitHub API calls will fail.');
    }
    this.graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${githubToken}`,
      },
    });
  }

  /**
   * Scan all repositories for a GitHub user
   */
  async scanUserRepositories(username: string, maxRepos: number = 50, forceRefresh: boolean = false): Promise<any> {
    try {
      this.logger.log(`Scanning repositories for user: ${username}`);

      // Check if we have recent data (less than 24 hours old)
      if (!forceRefresh) {
        const existingData = await this.githubRepoModel.find({
          'owner.login': username,
          scannedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if (existingData.length > 0) {
          this.logger.log(`Returning cached data for ${username} (${existingData.length} repos)`);
          return {
            cached: true,
            count: existingData.length,
            repositories: existingData,
          };
        }
      }

      // Fetch repositories from GitHub
      const query = `
        query($username: String!, $first: Int!) {
          user(login: $username) {
            repositories(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}) {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                id
                name
                nameWithOwner
                description
                url
                homepageUrl
                isPrivate
                isFork
                stargazerCount
                forkCount
                watchers { totalCount }
                primaryLanguage { 
                  name 
                  color 
                }
                languages(first: 10) {
                  edges {
                    size
                    node { name }
                  }
                  totalSize
                }
                repositoryTopics(first: 10) {
                  nodes { 
                    topic { name } 
                  }
                }
                createdAt
                updatedAt
                pushedAt
                diskUsage
                defaultBranchRef { 
                  name 
                  target {
                    ... on Commit {
                      history(first: 5) {
                        nodes {
                          oid
                          message
                          author {
                            name
                          }
                          committedDate
                        }
                      }
                    }
                  }
                }
                licenseInfo { 
                  name 
                  key 
                }
                owner {
                  login
                  avatarUrl
                  url
                  __typename
                }
              }
            }
          }
        }
      `;

      const response: any = await this.graphqlWithAuth(query, {
        username,
        first: maxRepos,
      });

      if (!response.user) {
        throw new HttpException(`User ${username} not found on GitHub`, HttpStatus.NOT_FOUND);
      }

      const repositories = response.user.repositories.nodes;
      const savedRepos: GithubRepositoryDocument[] = [];

      // Transform and save each repository
      for (const repo of repositories) {
        const transformedRepo = this.transformRepositoryData(repo);
        const saved = await this.saveRepositoryData(transformedRepo);
        savedRepos.push(saved);
      }

      this.logger.log(`Successfully scanned ${savedRepos.length} repositories for ${username}`);

      return {
        cached: false,
        count: savedRepos.length,
        totalCount: response.user.repositories.totalCount,
        hasMore: response.user.repositories.pageInfo.hasNextPage,
        repositories: savedRepos,
      };

    } catch (error) {
      this.logger.error(`Error scanning repositories for ${username}:`, error.message);

      if (error.status === 401) {
        throw new HttpException('Invalid GitHub token. Please check GITHUB_TOKEN in .env', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        error.message || 'Failed to scan GitHub repositories',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Scan a single repository
   */
  async scanSingleRepository(owner: string, name: string, forceRefresh: boolean = false): Promise<any> {
    try {
      this.logger.log(`Scanning repository: ${owner}/${name}`);

      const fullName = `${owner}/${name}`;

      // Check for cached data
      if (!forceRefresh) {
        const existing = await this.githubRepoModel.findOne({
          fullName,
          scannedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if (existing) {
          this.logger.log(`Returning cached data for ${fullName}`);
          return { cached: true, repository: existing };
        }
      }

      const query = `
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            id
            name
            nameWithOwner
            description
            url
            homepageUrl
            isPrivate
            isFork
            stargazerCount
            forkCount
            watchers { totalCount }
            primaryLanguage { name color }
            languages(first: 10) {
              edges {
                size
                node { name }
              }
              totalSize
            }
            repositoryTopics(first: 10) {
              nodes { topic { name } }
            }
            createdAt
            updatedAt
            pushedAt
            diskUsage
            defaultBranchRef { 
              name 
              target {
                ... on Commit {
                  history(first: 5) {
                    nodes {
                      oid
                      message
                      author { name }
                      committedDate
                    }
                  }
                }
              }
            }
            licenseInfo { name key }
            owner {
              login
              avatarUrl
              url
              __typename
            }
          }
        }
      `;

      const response: any = await this.graphqlWithAuth(query, { owner, name });

      if (!response.repository) {
        throw new HttpException(`Repository ${fullName} not found`, HttpStatus.NOT_FOUND);
      }

      const transformedRepo = this.transformRepositoryData(response.repository);
      const saved = await this.saveRepositoryData(transformedRepo);

      return { cached: false, repository: saved };

    } catch (error) {
      this.logger.error(`Error scanning repository ${owner}/${name}:`, error.message);
      throw new HttpException(
        error.message || 'Failed to scan repository',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get stored repositories for a user
   */
  async getStoredRepositories(username: string): Promise<GithubRepositoryDocument[]> {
    return this.githubRepoModel.find({ 'owner.login': username }).sort({ scannedAt: -1 });
  }

  /**
   * Get a single stored repository
   */
  async getStoredRepository(owner: string, name: string): Promise<GithubRepositoryDocument> {
    const fullName = `${owner}/${name}`;
    const repo = await this.githubRepoModel.findOne({ fullName });

    if (!repo) {
      throw new HttpException(`Repository ${fullName} not found in database`, HttpStatus.NOT_FOUND);
    }

    return repo;
  }

  /**
   * Get aggregated statistics for a user
   */
  async getUserStats(username: string): Promise<any> {
    const repos = await this.githubRepoModel.find({ 'owner.login': username });

    if (repos.length === 0) {
      throw new HttpException(`No data found for user ${username}. Please scan first.`, HttpStatus.NOT_FOUND);
    }

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazersCount, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forksCount, 0);

    // Language statistics
    const languageStats = new Map<string, number>();
    repos.forEach(repo => {
      if (repo.primaryLanguage) {
        const count = languageStats.get(repo.primaryLanguage.name) || 0;
        languageStats.set(repo.primaryLanguage.name, count + 1);
      }
    });

    const languages = Array.from(languageStats.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      username,
      totalRepositories: repos.length,
      totalStars,
      totalForks,
      languages,
      mostStarredRepo: repos.sort((a, b) => b.stargazersCount - a.stargazersCount)[0],
      lastScanned: repos[0]?.scannedAt,
    };
  }

  /**
   * Delete stored repositories for a user
   */
  async deleteUserRepositories(username: string): Promise<any> {
    const result = await this.githubRepoModel.deleteMany({ 'owner.login': username });
    return {
      deleted: result.deletedCount,
      message: `Deleted ${result.deletedCount} repositories for ${username}`,
    };
  }

  /**
   * Transform GitHub API response to our schema format
   */
  private transformRepositoryData(repo: any): any {
    const languagesData = repo.languages?.edges || [];
    const totalSize = repo.languages?.totalSize || 1;

    const languages = languagesData.map((edge: any) => ({
      name: edge.node.name,
      size: edge.size,
      percentage: (edge.size / totalSize) * 100,
    }));

    const commits = repo.defaultBranchRef?.target?.history?.nodes || [];
    const recentCommits = commits.map((commit: any) => ({
      sha: commit.oid,
      message: commit.message,
      author: commit.author?.name || 'Unknown',
      date: new Date(commit.committedDate),
    }));

    return {
      githubId: repo.id,
      name: repo.name,
      fullName: repo.nameWithOwner,
      description: repo.description || '',
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatarUrl,
        type: repo.owner.__typename,
        url: repo.owner.url,
      },
      url: repo.url,
      homepageUrl: repo.homepageUrl || '',
      isPrivate: repo.isPrivate,
      isFork: repo.isFork,
      stargazersCount: repo.stargazerCount,
      forksCount: repo.forkCount,
      watchersCount: repo.watchers?.totalCount || 0,
      primaryLanguage: repo.primaryLanguage ? {
        name: repo.primaryLanguage.name,
        color: repo.primaryLanguage.color,
      } : null,
      languages,
      topics: repo.repositoryTopics?.nodes?.map((node: any) => node.topic.name) || [],
      repositoryCreatedAt: new Date(repo.createdAt),
      repositoryUpdatedAt: new Date(repo.updatedAt),
      pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : null,
      diskUsage: repo.diskUsage || 0,
      recentCommits,
      licenseInfo: repo.licenseInfo ? {
        name: repo.licenseInfo.name,
        key: repo.licenseInfo.key,
      } : null,
      defaultBranch: repo.defaultBranchRef?.name || 'main',
      scannedAt: new Date(),
    };
  }

  /**
   * Save or update repository data in MongoDB
   */
  private async saveRepositoryData(repoData: any): Promise<GithubRepositoryDocument> {
    const existing = await this.githubRepoModel.findOne({ githubId: repoData.githubId });

    if (existing) {
      // Update existing record
      Object.assign(existing, repoData);
      return existing.save();
    } else {
      // Create new record
      const newRepo = new this.githubRepoModel(repoData);
      return newRepo.save();
    }
  }

  /**
   * Check if user is eligible for GitHub scan (weekly limit)
   */
  async checkScanEligibility(userId: string): Promise<{ eligible: boolean; reason?: string; nextAvailableAt?: Date }> {
    const scanRecord = await this.userGithubScanModel.findOne({ userId });

    if (!scanRecord) {
      return { eligible: true }; // First time scan
    }

    const now = new Date();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const timeSinceLastScan = now.getTime() - scanRecord.lastScanDate.getTime();

    if (timeSinceLastScan < weekInMs) {
      return {
        eligible: false,
        reason: 'Weekly scan limit reached. You can scan once per week.',
        nextAvailableAt: scanRecord.nextScanAvailableAt,
      };
    }

    return { eligible: true };
  }

  /**
   * Scan user repositories with weekly limit check
   */
  async scanUserRepositoriesWithLimit(userId: string, username: string, maxRepos: number = 50): Promise<any> {
    // Check eligibility
    const eligibility = await this.checkScanEligibility(userId);

    if (!eligibility.eligible) {
      throw new HttpException(
        {
          message: eligibility.reason,
          nextAvailableAt: eligibility.nextAvailableAt,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Perform scan
    const result = await this.scanUserRepositories(username, maxRepos, true);

    // Update scan record
    await this.updateScanRecord(userId, username);

    return result;
  }

  /**
   * Update user scan record after successful scan
   */
  private async updateScanRecord(userId: string, githubUsername: string): Promise<void> {
    const now = new Date();
    const nextScanDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const existing = await this.userGithubScanModel.findOne({ userId });

    if (existing) {
      existing.lastScanDate = now;
      existing.scanCount += 1;
      existing.nextScanAvailableAt = nextScanDate;
      existing.isEligibleForScan = false;
      await existing.save();
    } else {
      // First scan
      const newRecord = new this.userGithubScanModel({
        userId,
        githubUsername,
        lastScanDate: now,
        scanCount: 1,
        weeklyScansRemaining: 0,
        nextScanAvailableAt: nextScanDate,
        isEligibleForScan: false,
      });
      await newRecord.save();
    }

    this.logger.log(`Updated scan record for user ${userId}. Next scan available at: ${nextScanDate}`);
  }

  /**
   * Scan GitHub repositories on user registration (first time, no limit)
   */
  async scanOnRegistration(userId: string, githubUsername: string): Promise<any> {
    this.logger.log(`Performing initial GitHub scan for new user: ${userId} (${githubUsername})`);

    try {
      // Scan repositories
      const result = await this.scanUserRepositories(githubUsername, 50, true);

      // Create scan record
      await this.updateScanRecord(userId, githubUsername);

      this.logger.log(`Successfully completed initial scan for user ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to scan GitHub on registration for user ${userId}:`, error.message);
      // Don't throw error - registration should succeed even if GitHub scan fails
      return null;
    }
  }

  /**
   * Get user's scan status and eligibility
   */
  async getUserScanStatus(userId: string): Promise<any> {
    const scanRecord = await this.userGithubScanModel.findOne({ userId });

    if (!scanRecord) {
      return {
        hasScanned: false,
        eligible: true,
        message: 'You haven\'t scanned your GitHub repositories yet.',
      };
    }

    const eligibility = await this.checkScanEligibility(userId);

    return {
      hasScanned: true,
      githubUsername: scanRecord.githubUsername,
      lastScanDate: scanRecord.lastScanDate,
      scanCount: scanRecord.scanCount,
      nextScanAvailableAt: scanRecord.nextScanAvailableAt,
      eligible: eligibility.eligible,
      message: eligibility.eligible
        ? 'You can scan your GitHub repositories now!'
        : eligibility.reason,
    };
  }

  /**
   * Get intelligent analysis of user's repositories
   * Categorizes by frontend, backend, mobile, fullstack, etc.
   */
  async getIntelligentAnalysis(username: string): Promise<any> {
    this.logger.log(`Performing intelligent analysis for user: ${username}`);

    // Get all repositories for user
    const repositories = await this.githubRepoModel.find({ 'owner.login': username });

    if (repositories.length === 0) {
      throw new HttpException(
        `No repositories found for ${username}. Please scan first.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Analyze all repositories
    const analysis = this.repositoryAnalyzer.analyzeAllRepositories(repositories);

    return {
      username,
      totalRepositories: repositories.length,
      analyzedAt: new Date(),
      summary: analysis.summary,
      categorized: {
        frontend: analysis.categorized.frontend.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          url: r.url,
          stars: r.stargazersCount,
          technologies: r.analysis.technologies,
          frameworks: r.analysis.frameworks,
          confidence: r.analysis.confidence,
        })),
        backend: analysis.categorized.backend.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          url: r.url,
          stars: r.stargazersCount,
          technologies: r.analysis.technologies,
          frameworks: r.analysis.frameworks,
          confidence: r.analysis.confidence,
        })),
        mobile: analysis.categorized.mobile.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          url: r.url,
          stars: r.stargazersCount,
          technologies: r.analysis.technologies,
          frameworks: r.analysis.frameworks,
          confidence: r.analysis.confidence,
        })),
        fullstack: analysis.categorized.fullstack.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          url: r.url,
          stars: r.stargazersCount,
          technologies: r.analysis.technologies,
          frameworks: r.analysis.frameworks,
          confidence: r.analysis.confidence,
        })),
        devops: analysis.categorized.devops.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          url: r.url,
          stars: r.stargazersCount,
          technologies: r.analysis.technologies,
          confidence: r.analysis.confidence,
        })),
        dataScience: analysis.categorized.dataScience.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          url: r.url,
          stars: r.stargazersCount,
          technologies: r.analysis.technologies,
          frameworks: r.analysis.frameworks,
          confidence: r.analysis.confidence,
        })),
        other: analysis.categorized.other.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          url: r.url,
          stars: r.stargazersCount,
          technologies: r.analysis.technologies,
        })),
      },
      topTechnologies: analysis.topTechnologies,
      topFrameworks: analysis.topFrameworks,
    };
  }
}


