import { NotImplementedException } from '@nestjs/common';
import {
  ExecuteProps,
  ILoggerProvider,
  MapArg,
  MapProps,
  MapReturn,
  WithTransaction,
} from '@shared/models';
import { AppError } from '../models';

export abstract class BaseStrategy<M = never> {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
    private readonly mapper?: M,
  ) {
    this.referrer = `${this.name}[strategy]`;
  }

  protected async execute<T>({ fn }: ExecuteProps<T>): Promise<T>;
  protected async execute<T, K extends keyof M>({
    mapKey,
    fn,
  }: ExecuteProps<T> & { mapKey: K }): Promise<MapReturn<M, K>>;

  protected async execute<T, K extends keyof M>({
    mapKey,
    fn,
  }: ExecuteProps<T> & { mapKey?: K }): Promise<T | MapReturn<M, K>> {
    try {
      const value = await fn();

      if (!mapKey) {
        this.logger.info(this.referrer, { response: { value } });
        return value;
      }

      const mapped = this.map({ key: mapKey, data: value as MapArg<M[K]> });
      this.logger.info(this.referrer, { response: { value, mapped } });

      return mapped;
    } catch (error) {
      throw AppError.handler({
        referrer: this.referrer,
        logger: this.logger,
        error,
      });
    }
  }

  protected async withTransaction<T>({
    fn,
    connection,
  }: WithTransaction<T>): Promise<T> {
    const session = await connection.startSession();
    session.startTransaction();

    try {
      const value = await fn(session);
      await session.commitTransaction();

      this.logger.info(this.referrer, { response: { value } });
      return value;
    } catch (error) {
      await session.abortTransaction();
      throw AppError.handler({
        referrer: this.referrer,
        logger: this.logger,
        error,
      });
    } finally {
      await session.endSession();
    }
  }

  private map<K extends keyof M>({
    key,
    data,
  }: MapProps<M, K>): MapReturn<M, K> {
    if (!this.mapper) {
      throw new NotImplementedException({
        message: 'Mapper not implemented!',
      });
    }

    return (this.mapper[key] as Function)(data);
  }
}
