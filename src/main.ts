import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

const DEFAULT_APP_HORT = 'localhost';
const DEFAULT_APP_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const secondsDay = 86400;

  const port = configService.get('PORT', DEFAULT_APP_PORT);
  const hostname = configService.get('HOST', DEFAULT_APP_HORT);

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || '*',
    credentials: true,
    maxAge: secondsDay,
    methods: ['GET', 'POST'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(port, hostname, () =>
    console.log(`Server running at https://${hostname}:${port}`),
  );
}
bootstrap();
