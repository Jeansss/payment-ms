import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from '@nestjs/class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Order Manager API')
    .setDescription('This is the API from our FIAP Tech Challenge')
    .setVersion('1.0')
    //.addTag('Order-Manager')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3003);
}
bootstrap();
