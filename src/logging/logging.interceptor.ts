import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggingService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const response = context.switchToHttp().getResponse();

    const responseBody = next.handle();
    this.logger.logResponse(response.statusCode, responseBody);
    return responseBody;
  }
}
