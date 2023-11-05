import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appPort = process.env.APP_PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appPort).then(() => {
    console.log(`Server is running on port ${appPort}`);
  });
}
bootstrap();
