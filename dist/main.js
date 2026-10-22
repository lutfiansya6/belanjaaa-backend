import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new DocumentBuilder()
        .setTitle('Belanjaaa Marketplace API')
        .setDescription('Dokumentasi REST API marketplace e-commerce')
        .setVersion('1.0')
        .addTag('Root', 'Informasi root API')
        .addTag('Auth', 'Otentikasi dan sesi pengguna')
        .addTag('Products', 'Katalog dan pencarian produk')
        .addTag('Categories', 'Kategori produk marketplace')
        .addTag('Health', 'Pemeriksaan status sistem')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`Backend server running on: http://localhost:${port}/api/v1`);
    console.log(`Swagger documentation available at: http://localhost:${port}/docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map