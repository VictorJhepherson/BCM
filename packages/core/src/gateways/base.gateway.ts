import { ExecuteProps, ILoggerProvider } from '@shared/models';
import { AppError } from '../models';

export abstract class BaseGateway {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[gateway]`;
  }

  protected async execute<T>({ fn }: ExecuteProps<T>): Promise<T> {
    try {
      const value = await fn();
      this.logger.info(this.referrer, { response: { value } });

      return value;
    } catch (error) {
      throw AppError.handler({
        referrer: this.referrer,
        logger: this.logger,
        error,
      });
    }
  }
}
