import { Module, NestModule ,MiddlewareConsumer,Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import{RateLimitMiddleware}from'./common/auth/middlewares/rate-limit.middleware'
import { AuthGuard } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { UtilsModule } from './utils/utils.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import { SchemasModule } from './schemas/schemas.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './common/auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AlgorithmModule } from './algorithm/algorithm.module';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsService } from './metrics/metrics.service';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // MongoDB Atlas connection
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_project_db'),
  
     
    CommonModule, 
    SchemasModule,
    MediaModule, 
    UtilsModule,
    HealthModule, 
    UsersModule,
    AuthModule,
    ProjectsModule,
    AlgorithmModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{

  constructor(private readonly metricsService: MetricsService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');
    
    // Metrics middleware'i tüm route'lara uygula
    consumer
      .apply((req: any, res: any, next: any) => {
        const start = Date.now();
        
        res.on('finish', () => {
          const duration = (Date.now() - start) / 1000;
          const method = req.method;
          const route = req.route?.path || req.path;
          const statusCode = res.statusCode;
          
          this.metricsService.recordHttpRequest(method, route, statusCode, duration);
        });
        
        next();
      })
      .forRoutes('*');
  }



}
