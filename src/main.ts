import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // CORS configuration for Next.js frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Global ValidationPipe using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation at /docs
  const config = new DocumentBuilder()
    .setTitle('Belanjaaa Marketplace API')
    .setDescription('Dokumentasi REST API marketplace e-commerce')
    .setVersion('1.0')
    .addTag('Health', 'Pemeriksaan status sistem')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend server running on: http://localhost:${port}/api/v1`);
  console.log(`Swagger documentation available at: http://localhost:${port}/docs`);
}

void bootstrap();
