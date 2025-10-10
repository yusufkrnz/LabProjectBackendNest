import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './auth/jwt/jwt.service';
import { JWT_SECRET } from './constants/auth.constants';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtAuthService],
  exports: [JwtAuthService, JwtModule], // Diğer modüller kullanabilsin
})
export class CommonModule {}
