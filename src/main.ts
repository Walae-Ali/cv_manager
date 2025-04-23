import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Auth/guards/jwt-auth.guard';

import { VersioningType } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type:VersioningType.URI,
  });
  
    // Serve static files from the "public" directory
    app.useStaticAssets(join(__dirname, '..', 'public'));
    const config = new DocumentBuilder()
    .setTitle('API ')
    .setDescription('Documentation de l’API ')
    .setVersion('1.0')
    .addBearerAuth() // si tu utilises JWT
    .build();
   // app.useGlobalGuards(new JwtAuthGuard());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
