import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from '@shared/helpers';
import { Environment, ILoggerProvider } from '@shared/models';

@Injectable()
export class LoggerProvider implements ILoggerProvider {
  private readonly isEnabled: boolean;

  constructor(private readonly config: ConfigService) {
    this.isEnabled =
      this.config.get<Environment>('ENVIRONMENT') === Environment.DEBUG;
  }

  info<T>(referrer: string, options: T): void {
    if (!this.isEnabled) return;
    console.info(`[INFO]${referrer}`, this.format(options));
  }

  warn<T>(referrer: string, options: T): void {
    if (!this.isEnabled) return;
    console.warn(`[WARN]${referrer}`, this.format(options));
  }

  error<T>(referrer: string, options: T): void {
    if (!this.isEnabled) return;
    console.error(`[ERROR]${referrer}`, this.format(options));
  }

  debug<T>(referrer: string, options: T): void {
    if (!this.isEnabled) return;
    console.debug(`[DEBUG]${referrer}`, this.format(options));
  }

  private format<T>(options: T): string {
    return format.base(options, { depth: null, colors: true });
  }
}
