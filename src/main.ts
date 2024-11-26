import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }

  return cachedApp(req, res);
}

// Executar localmente
if (process.env.VERCEL !== '1') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3004);
    console.log('Application is running on: http://localhost:3004');
  }
  bootstrap();
}
