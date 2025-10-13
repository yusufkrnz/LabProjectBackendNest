import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  
  // Endpoint bazlı sınırlar
  private limits = {
    '/auth/login': { max: 5, window: 15 * 60 * 1000 }, // 5 deneme/15 dakika
    '/auth/refresh': { max: 10, window: 15 * 60 * 1000 }, // 10 deneme/15 dakika
  };

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.connection.remoteAddress;
    const path = req.path;
    
    // 1. Endpoint sınırı var mı kontrol et
    const limit = this.limits[path];
    if (!limit) {
      return next();
    }

    // 2. IP için kayıt al
    const key = `${ip}:${path}`;
    const now = Date.now();
    
    if (!this.store[key] || this.store[key].resetTime < now) {
      // 3. Yeni pencere başlat
      this.store[key] = {
        count: 1,
        resetTime: now + limit.window,
      };
    } else {
      // 4. Mevcut pencereyi güncelle
      this.store[key].count++;
      
      // 5. Sınırı aştıysa engelle
      if (this.store[key].count > limit.max) {
        throw new HttpException(
          'Too many requests, please try again later',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
    }

    next();
  }
}