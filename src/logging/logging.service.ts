import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
}

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel = Number(process.env.LOG_LEVEL) || LogLevel.LOG;
  private logFilePath = path.join(__dirname, '../../logs/app.log');
  private errorLogFilePath = path.join(__dirname, '../../logs/error.log');
  private maxLogSize = Number(process.env.MAX_LOG_SIZE) * 1024;

  private checkLogFileRotation(filePath: string) {
    const stats = fs.statSync(filePath);
    if (stats.size > this.maxLogSize) {
      fs.renameSync(filePath, `${filePath}.${Date.now()}`);
    }
  }

  private logToFile(filePath: string, message: string) {
    this.checkLogFileRotation(filePath);
    fs.appendFileSync(filePath, message + '\n');
  }

  private formatLog(level: LogLevel, message: string): string {
    return `[${new Date().toISOString()}] ${LogLevel[level]}: ${message}`;
  }

  log(message: string) {
    if (this.logLevel >= LogLevel.LOG) {
      const formatted = this.formatLog(LogLevel.LOG, message);
      this.logToFile(this.logFilePath, formatted);
      console.log(formatted);
    }
  }

  error(message: string, trace?: string) {
    if (this.logLevel >= LogLevel.ERROR) {
      const formatted = this.formatLog(LogLevel.ERROR, message);
      this.logToFile(this.logFilePath, formatted);
      this.logToFile(this.errorLogFilePath, formatted);
      console.error(formatted);
      if (trace) console.error(trace);
    }
  }

  warn(message: string) {
    if (this.logLevel >= LogLevel.WARN) {
      const formatted = this.formatLog(LogLevel.WARN, message);
      this.logToFile(this.logFilePath, formatted);
      console.warn(formatted);
    }
  }

  debug(message: string) {
    if (this.logLevel >= LogLevel.DEBUG) {
      const formatted = this.formatLog(LogLevel.DEBUG, message);
      this.logToFile(this.logFilePath, formatted);
      console.debug(formatted);
    }
  }

  logResponse(
    statusCode: number,
    responseBody: string | object | undefined,
  ): any {
    let responseBodyString = 'N/A';

    if (typeof responseBody === 'string') {
      responseBodyString = responseBody;
    } else if (typeof responseBody === 'object') {
      responseBodyString = JSON.stringify(responseBody);
    }

    this.log(`Response: Status code ${statusCode}; Body ${responseBodyString}`);
  }
}
