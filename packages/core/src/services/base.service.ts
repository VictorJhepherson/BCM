import { ILoggerProvider } from '@shared/models';
import { ExecutorBuilder } from '../builders/executor.builder';
import { ExecutorProps } from './base.service.types';

export abstract class BaseService {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[service]`;
  }

  protected execute<T>({ fn }: ExecutorProps<T>): Promise<T> {
    const builder = new ExecutorBuilder<T>(this.logger, {
      referrer: this.referrer,
    });

    return fn(builder);
  }
}
