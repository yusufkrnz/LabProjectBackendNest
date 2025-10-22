import { Controller, Get, Req, Res, Next } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await this.metricsService.getMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  }

  // Middleware olarak kullanılacak
  static middleware(metricsService: MetricsService) {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const method = req.method;
        const route = req.route?.path || req.path;
        const statusCode = res.statusCode;
        
        metricsService.recordHttpRequest(method, route, statusCode, duration);
      });
      
      next();
    };
  }
}
