import { ExecuteProps, ILoggerProvider } from '@shared/models';
import { FacadeQueryBuilder } from '../builders/query/query.builder';
import { AppError } from '../models';

export abstract class BaseController {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[controller]`;
  }

  protected async execute<T>({
    fn,
  }: ExecuteProps<T, FacadeQueryBuilder>): Promise<T> {
    try {
      const builer = new FacadeQueryBuilder(this.logger, {
        referrer: this.referrer,
      });

      const value = await fn(builer);
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
