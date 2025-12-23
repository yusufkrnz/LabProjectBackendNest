import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Payment } from './entities/payment.entity';
import { GithubQlModule } from './github-ql/github-ql.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_project_db',
    ),
    UsersModule,
    AuthModule,
    GithubQlModule,
    MessageModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
