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
      const response = await fn();
      this.logger.debug(this.referrer, { response });

      return response;
    } catch (error) {
      this.logger.error(this.referrer, { error });
      throw AppError.handler({
        referrer: this.referrer,
        error,
      });
    }
  }
}
