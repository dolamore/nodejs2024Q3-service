import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
    bufferLogs: true,
  });

  app.useLogger(app.get('LoggingService'));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  const config = new DocumentBuilder()
    .setTitle('Home Library API')
    .setDescription('The Home Library API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const loggingService = app.get(LoggingService);

  process.on('uncaughtException', (err, origin) => {
    loggingService.error(
      `Uncaught exception (listener): ${err}. Exception origin: ${origin}.`,
    );
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(`Unhandled Rejection (listener): ${reason}`);
  });

  await app.listen(port);
}

bootstrap();
