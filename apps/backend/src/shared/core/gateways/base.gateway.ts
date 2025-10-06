import { AppError } from '@/shared/core';
import { ILoggerProvider, TRunProps } from '@/shared/models';

export abstract class BaseGateway {
  private readonly referrer: string;

  protected constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[gateway]`;
  }

  protected async run<T>({ fn }: TRunProps<T>): Promise<T> {
    try {
      const response = await fn();
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
