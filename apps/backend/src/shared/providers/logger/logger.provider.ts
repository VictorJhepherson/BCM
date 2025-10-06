import { format } from '@/shared/helpers';
import { ILoggerProvider } from '@/shared/models';

import { Logging, LoggingLevel } from '@bcm/models';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerProvider implements ILoggerProvider {
  constructor(private readonly config: ConfigService) {}

  info<T>(referrer: string, options: T): void {
    if (!this.isEnabled(LoggingLevel.INFO)) return;
    console.info(`[INFO]${referrer}`, this.format(options));
  }

  warn<T>(referrer: string, options: T): void {
    if (!this.isEnabled(LoggingLevel.WARN)) return;
    console.warn(`[WARN]${referrer}`, this.format(options));
  }

  error<T>(referrer: string, options: T): void {
    if (!this.isEnabled(LoggingLevel.ERROR)) return;
    console.error(`[ERROR]${referrer}`, this.format(options));
  }

  debug<T>(referrer: string, options: T): void {
    if (!this.isEnabled(LoggingLevel.DEBUG)) return;
    console.debug(`[DEBUG]${referrer}`, this.format(options));
  }

  private isEnabled(level: LoggingLevel): boolean {
    const enabled = this.config.get<string>('LOGGING') === Logging.ENABLED;
    const loggings = this.config.get<string>('LOGGING_LEVEL') || '';

    const levels = loggings.split(',');
    return enabled && levels.includes(level);
  }

  private format<T>(options: T): string {
    return format.base(options, { depth: null, colors: true });
  }
}
