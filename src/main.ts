import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import bodyParser from 'body-parser';

import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3004);
}

bootstrap();
