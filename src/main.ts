import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { env } from 'process';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(env.PORT);
}
bootstrap();
