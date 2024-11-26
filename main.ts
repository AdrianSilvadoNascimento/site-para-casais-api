import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';
import { AppModule } from './src/app.module';
import { env } from 'process';
// import { VercelRequest, VercelResponse } from '@vercel/node';

// let cachedApp: any = null;

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   console.log('está chegando no serveless');
//   if (!cachedApp) {
//     const app = await NestFactory.create(AppModule);
//     app.enableCors();
//     app.use(bodyParser.json({ limit: '50mb' }));
//     app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//     cachedApp = app.getHttpAdapter().getInstance();
//   }

//   return cachedApp(req, res);
// }

// Executar localmente
// if (process.env.VERCEL !== '1') {
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(env.PORT || 10000);
  console.log(`Application is running on: http://localhost:${env.PORT}`);
}
bootstrap();
// }
