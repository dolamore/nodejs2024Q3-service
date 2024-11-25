import { Controller, Get } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';

@Controller()
export class AppController {
  constructor(private readonly logger: LoggingService) {}

  @Get('check-logger')
  async checkLogger() {
    this.logger.error('Logger error');
    this.logger.warn('Logger warn');
    this.logger.log('Logger log');
    this.logger.debug('Logger debug');

    return {
      message:
        'Check the logs - all levels should have been logged if according to LOG_LEVEL.',
    };
  }

  @Get('check-error')
  async checkError() {
    throw new Error('This is a test error');
  }
}
