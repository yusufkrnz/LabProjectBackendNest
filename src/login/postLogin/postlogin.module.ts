import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { PostloginController } from './postlogin.controller';
import { PostloginService } from './postlogin.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule,
  ],
  controllers: [PostloginController],
  providers: [PostloginService],
  exports: [PostloginService],
})
export class PostloginModule {}
