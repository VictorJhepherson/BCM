import { ExecuteProps, ILoggerProvider } from '@shared/models';
import { AppError } from '../models';

export abstract class BaseController {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[controller]`;
  }

  protected async execute<T>({ fn }: ExecuteProps<T>): Promise<T> {
    try {
      const value = await fn();
      this.logger.info(this.referrer, { response: { value } });

      return value;
    } catch (error) {
      throw AppError.withLogger(this.logger, {
        referrer: this.referrer,
        error,
      });
    }
  }
}
