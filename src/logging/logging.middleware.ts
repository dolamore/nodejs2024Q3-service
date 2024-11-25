import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Request: ${req.method} ${req.originalUrl}; Body ${JSON.stringify(
        req.body,
      )}`,
    );

    res.on('finish', () => {
      this.logger.log(
        `Response: ${res.statusCode}; Body: ${JSON.stringify(res.locals)}`,
      );
    });

    next();
  }
}
