import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingExceptionsFilter } from './logging-exceptions.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  providers: [
    LoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionsFilter,
    },
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
