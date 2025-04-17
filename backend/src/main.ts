import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Global validation pipe 
  app.useGlobalPipes(new ValidationPipe());
  
  // Configure WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Inspiro Draw API')
    .setDescription('The Inspiro Draw API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap(); 