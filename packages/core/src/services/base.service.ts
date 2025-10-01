import { ILoggerProvider } from '@shared/models';
import { ExecutorBuilder } from '../builders/executor.builder';
import { AppError } from '../models';
import { ExecutorProps } from './base.service.types';

export abstract class BaseService {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[service]`;
  }

  protected async execute<T>({ fn }: ExecutorProps<T>): Promise<T> {
    try {
      const builder = new ExecutorBuilder<T>(this.logger, {
        referrer: this.referrer,
      });

      const value = await fn(builder);
      this.logger.info(this.referrer, { response: { value } });

      return value;
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: this.referrer,
        error,
      });
    }
  }
}
