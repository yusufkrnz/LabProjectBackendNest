import { Controller, Get, Post, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GithubQlService } from './github-ql.service';
import { ScanGithubUserDto, ScanRepositoryDto } from './dto/scan-github.dto';

@ApiTags('GitHub GraphQL')
@Controller('github-ql')
export class GithubQlController {
    constructor(private readonly githubQlService: GithubQlService) { }

    @Post('scan/user')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Scan all repositories for a GitHub user' })
    @ApiResponse({ status: 200, description: 'Repositories scanned successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 401, description: 'Invalid GitHub token' })
    async scanUser(@Body() dto: ScanGithubUserDto) {
        return this.githubQlService.scanUserRepositories(
            dto.username,
            dto.maxRepos || 50,
            dto.forceRefresh || false,
        );
    }

    @Post('scan/repository')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Scan a single GitHub repository' })
    @ApiResponse({ status: 200, description: 'Repository scanned successfully' })
    @ApiResponse({ status: 404, description: 'Repository not found' })
    async scanRepository(@Body() dto: ScanRepositoryDto) {
        return this.githubQlService.scanSingleRepository(
            dto.owner,
            dto.name,
            dto.forceRefresh || false,
        );
    }

    @Get('repositories/:username')
    @ApiOperation({ summary: 'Get stored repositories for a user' })
    @ApiParam({ name: 'username', description: 'GitHub username' })
    @ApiResponse({ status: 200, description: 'Returns stored repositories' })
    async getRepositories(@Param('username') username: string) {
        return this.githubQlService.getStoredRepositories(username);
    }

    @Get('repository/:owner/:name')
    @ApiOperation({ summary: 'Get a single stored repository' })
    @ApiParam({ name: 'owner', description: 'Repository owner' })
    @ApiParam({ name: 'name', description: 'Repository name' })
    @ApiResponse({ status: 200, description: 'Returns repository details' })
    @ApiResponse({ status: 404, description: 'Repository not found in database' })
    async getRepository(
        @Param('owner') owner: string,
        @Param('name') name: string,
    ) {
        return this.githubQlService.getStoredRepository(owner, name);
    }

    @Get('stats/:username')
    @ApiOperation({ summary: 'Get aggregated statistics for a user' })
    @ApiParam({ name: 'username', description: 'GitHub username' })
    @ApiResponse({ status: 200, description: 'Returns user statistics' })
    @ApiResponse({ status: 404, description: 'No data found for user' })
    async getUserStats(@Param('username') username: string) {
        return this.githubQlService.getUserStats(username);
    }

    @Delete('repositories/:username')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete stored repositories for a user' })
    @ApiParam({ name: 'username', description: 'GitHub username' })
    @ApiResponse({ status: 200, description: 'Repositories deleted successfully' })
    async deleteRepositories(@Param('username') username: string) {
        return this.githubQlService.deleteUserRepositories(username);
    }

    @Get('scan-status/:userId')
    @ApiOperation({ summary: 'Get user GitHub scan status and eligibility' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Returns scan status and eligibility' })
    async getScanStatus(@Param('userId') userId: string) {
        return this.githubQlService.getUserScanStatus(userId);
    }

    @Post('rescan/:userId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Manually re-scan user repositories (with weekly limit)' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Repositories re-scanned successfully' })
    @ApiResponse({ status: 429, description: 'Weekly scan limit reached' })
    async rescanRepositories(
        @Param('userId') userId: string,
        @Body() body: { githubUsername: string; maxRepos?: number }
    ) {
        return this.githubQlService.scanUserRepositoriesWithLimit(
            userId,
            body.githubUsername,
            body.maxRepos || 50
        );
    }

    @Get('analyze/:username')
    @ApiOperation({ summary: 'Get intelligent analysis of user repositories (categorized by tech stack)' })
    @ApiParam({ name: 'username', description: 'GitHub username' })
    @ApiResponse({ status: 200, description: 'Returns categorized repositories and tech stack analysis' })
    @ApiResponse({ status: 404, description: 'No repositories found. Please scan first.' })
    async getIntelligentAnalysis(@Param('username') username: string) {
        return this.githubQlService.getIntelligentAnalysis(username);
    }
}
