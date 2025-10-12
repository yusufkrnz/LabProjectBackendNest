import { Request, Response } from 'express'; // ✅ sadece express'ten

export class CookieUtil {
  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    path: '/',
  };

  static setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, this.COOKIE_OPTIONS);
  }

  static clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', this.COOKIE_OPTIONS);
  }

  static getRefreshTokenCookie(req: Request): string | undefined {
    return req.cookies?.refreshToken;
  }
}
