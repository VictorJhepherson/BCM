import { AppError } from '@/shared/core';
import { OperationBuilder } from '@/shared/core/builders';
import { ILoggerProvider, TRunProps } from '@/shared/models';

export abstract class BaseService {
  private readonly referrer: string;

  protected constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[service]`;
  }

  protected async run<T>({
    fn,
  }: TRunProps<T, OperationBuilder<T>>): Promise<T> {
    try {
      const builder = new OperationBuilder<T>(this.logger, {
        referrer: this.referrer,
      });

      const response = await fn(builder);
      this.logger.info(this.referrer, { response });

      return response;
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: this.referrer,
        error,
      });
    }
  }
}
