import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoginMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    // 1. Request'i logla
    this.logger.log(`${method} ${originalUrl} - ${ip} - ${userAgent}`);

    // 2. Response tamamlandığında logla
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`
      );
    });

    next();
  }
}