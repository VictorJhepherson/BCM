import { ExecuteProps, ILoggerProvider, WithTransaction } from '@shared/models';
import { Connection } from 'mongoose';
import { AppError } from '../models';

export abstract class BaseStrategy {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
  ) {
    this.referrer = `${this.name}[strategy]`;
  }

  protected async execute<T>({ fn }: ExecuteProps<T>): Promise<T>;
  protected async execute<T>({
    fn,
  }: ExecuteProps<T> & { connection: Connection }): Promise<T>;

  protected async execute<T>({
    fn,
    connection,
  }: ExecuteProps<T> & { connection?: Connection }): Promise<T> {
    if (connection) {
      const session = await connection.startSession();
      session.startTransaction();

      return this.withTransaction({ fn, session });
    }

    try {
      const value = await fn();
      this.logger.info(this.referrer, { response: { value } });

      return value;
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: this.referrer,
        error,
      });
    }
  }

  private async withTransaction<T>({
    fn,
    session,
  }: WithTransaction<T>): Promise<T> {
    try {
      const value = await fn(session);
      await session.commitTransaction();

      this.logger.info(this.referrer, { response: { value } });
      return value;
    } catch (error) {
      await session.abortTransaction();

      throw AppError.handler(this.logger, {
        referrer: this.referrer,
        error,
      });
    } finally {
      await session.endSession();
    }
  }
}
