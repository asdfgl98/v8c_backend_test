import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  const config = new DocumentBuilder()
    .setTitle('브이에이트코프 게시판 Server')
    .setDescription('브이에이트코프 게시판 Server API description')
    .setVersion('1.0')
    .addTag('v8c API')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      in: 'header',
    },)
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-description', app, document);

  
  await app.listen(3000);


}
bootstrap();
