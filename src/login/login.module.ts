import { Module } from '@nestjs/common';
import { PreloginModule } from './preLogin/prelogin.module';
import { PostloginModule } from './postLogin/postlogin.module';

@Module({
  imports: [PreloginModule, PostloginModule],
  exports: [PreloginModule, PostloginModule],
})
export class LoginModule {}
