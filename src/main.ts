import * as crypto from 'crypto';

// only define if not already present
if (!globalThis.crypto) {
  (globalThis as any).crypto = crypto;
}
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors()
  console.log('Application is starting...',process.env.PORT );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
