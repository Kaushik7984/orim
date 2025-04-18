import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  console.log('Starting application...');
  console.log(
    'MongoDB URI:',
    process.env.DATABASE_URL ||
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/inspiro-draw',
  );

  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific options for Google authentication
  app.enableCors({
    origin: true, // Allow all origins for development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // Remove problematic security headers that interfere with Google login
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Remove headers that might interfere with popups
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    res.removeHeader('Cross-Origin-Resource-Policy');
    next();
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Configure WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Orim API')
    .setDescription('The Orim API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log('Application is running on: http://localhost:3001');
}
bootstrap();
