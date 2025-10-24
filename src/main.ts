import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
//swaggerr hatamız buymuş galiba
//Şimdi Swagger kurulumunu kontrol ettim.
// Sorun büyük ihtimalle ESM ortamında reflect-metadata’ın yüklenmemesinden kaynaklanıyor.
//  Nest 11 + TypeScript (moduleResolution: nodenext) ile decorator metadata’sının Swagger tarafından okunabilmesi için giriş dosyanızda reflect-metadata’ı en başta import etmeniz gerekir. Sizde reflect-metadata dependency var ama src/main.ts içinde import edilmiyor.
import 'reflect-metadata';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.use(cookieParser());
  
  // CORS ayarı - Frontend için
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });


const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API açıklaması')
    .setVersion('1.0')
    .addTag('users') // Opsiyonel: tag ekleyebilirsin
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document);

await app.listen(process.env.PORT ?? 3000);



}
bootstrap();
