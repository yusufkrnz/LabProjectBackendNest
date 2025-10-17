import { Controller, Req, Res, Body, UseGuards, UnauthorizedException, Get } from "@nestjs/common";
import type { Request, Response } from "express";
import { Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { JwtAuthGuard } from "./jwt/jwt.guard";
import { CookieUtil } from "./utils/cookie.util";
import { GoogleAuthGuard } from './guards/google.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

@ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 409, description: 'Username already exists' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const result = await this.authService.register(registerDto);
        return result;
    }
@ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);
        
        // Set refresh token as HttpOnly cookie
        CookieUtil.setRefreshTokenCookie(res, result.tokens.refreshToken);
        
        // Return access token in response body
        return {
            message: result.message,
            user: result.user,
            accessToken: result.tokens.accessToken
        };
    }
@ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = CookieUtil.getRefreshTokenCookie(req) || (req.body as any)?.refreshToken;
        
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token required');
        }
        
        const result = await this.authService.refresh(refreshToken);
        
        // Set new refresh token as HttpOnly cookie
        CookieUtil.setRefreshTokenCookie(res, result.tokens.refreshToken);
        
        return {
            message: result.message,
            accessToken: result.tokens.accessToken
        };
    }
@ApiOperation({ summary: 'User logout' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userId = (req as any).user?.sub;
        
        if (!userId) {
            throw new UnauthorizedException('User not found');
        }
        
        await this.authService.logout(userId);
        
        // Clear refresh token cookie
        CookieUtil.clearRefreshTokenCookie(res);
        
        return {
            message: 'Logout successful'
        };
    }

    // Google OAuth: Redirect to Google
    @ApiOperation({ summary: 'Google OAuth - redirect' })
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    // This route will redirect to Google, no body is returned
    async googleAuth() { return; }

    // Google OAuth: Callback handler
    @ApiOperation({ summary: 'Google OAuth - callback' })
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // req.user comes from GoogleStrategy.validate
        const googleUser = (req as any).user as {
            provider: 'google';
            googleId: string;
            email?: string;
            displayName?: string;
        };

        // Delegate to AuthService to find/create user and issue tokens
        const result = await this.authService.loginWithGoogle(googleUser);

        CookieUtil.setRefreshTokenCookie(res, result.tokens.refreshToken);

        return {
            message: result.message,
            user: result.user,
            accessToken: result.tokens.accessToken,
        };
    }
     
}