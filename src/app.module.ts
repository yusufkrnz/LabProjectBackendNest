import { Module, NestModule ,MiddlewareConsumer,Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import{RateLimitMiddleware}from'./common/auth/middlewares/rate-limit.middleware'
import { AuthGuard } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { UtilsModule } from './utils/utils.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import { SchemasModule } from './schemas/schemas.module';
import { UsersModule } from './users/users.module';
import { PreloginModule } from './login/preLogin/prelogin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './common/auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AlgorithmModule } from './algorithm/algorithm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Force local MongoDB to bypass Atlas temporarily
    MongooseModule.forRoot('mongodb://localhost:27017/lab_project_db'),
  
    LoginModule, 
    CommonModule, 
    SchemasModule,
    MediaModule, 
    UtilsModule,
    HealthModule, 
    UsersModule,
    PreloginModule,
    AuthModule,
    ProjectsModule,
    AlgorithmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');
  }



}
