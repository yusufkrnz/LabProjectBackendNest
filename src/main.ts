import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//swaggerr hatamız buymuş galiba
//Şimdi Swagger kurulumunu kontrol ettim.
// Sorun büyük ihtimalle ESM ortamında reflect-metadata’ın yüklenmemesinden kaynaklanıyor.
//  Nest 11 + TypeScript (moduleResolution: nodenext) ile decorator metadata’sının Swagger tarafından okunabilmesi için giriş dosyanızda reflect-metadata’ı en başta import etmeniz gerekir. Sizde reflect-metadata dependency var ama src/main.ts içinde import edilmiyor.
import 'reflect-metadata';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());


const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API açıklaması')
    .setVersion('1.0')
    .addTag('users') // Opsiyonel: tag ekleyebilirsin
    .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document);

await app.listen(process.env.PORT ?? 3000);



}
bootstrap();
