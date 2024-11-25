import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggingService } from './logging.service';

@Catch()
export class LoggingExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggingService,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      this.logger.logResponse(exception.getStatus(), exception.getResponse());

      httpAdapter.reply(
        ctx.getResponse(),
        exception.getResponse(),
        exception.getStatus(),
      );
      return;
    }

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      message: 'Internal Server Error',
    };

    this.logger.error(
      `Uncaught exception: ${exception.message} ${exception.stack}}`,
    );

    this.logger.logResponse(httpStatus, responseBody);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
