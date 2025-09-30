import { ILoggerProvider, PromiseFn } from '@shared/models';
import { ClientSession, Connection } from 'mongoose';
import { AppError } from '../models';
import { BuildOptions, ExecutorOptions } from './executor.builder.types';
import { MapBuilder } from './mapper/mapper.builder';

export class ExecutorBuilder<T> {
  private fn: PromiseFn<unknown, ClientSession>;
  private session: ClientSession;
  private connection: Connection;

  constructor(
    private readonly logger: ILoggerProvider,
    private readonly options: ExecutorOptions,
  ) {}

  use<P>(fn: PromiseFn<P, ClientSession>): this {
    this.fn = fn;
    return this;
  }

  withMapper<M>(mapper: M): MapBuilder<T, M> {
    return new MapBuilder<T, M>(mapper, this);
  }

  withConnection(connection: Connection): this {
    this.connection = connection;
    return this;
  }

  async build(): Promise<T>;
  async build({ transformers }: BuildOptions): Promise<T>;
  async build({ transformers = [] }: BuildOptions = {}): Promise<T> {
    try {
      if (this.connection) {
        this.session = await this.connection.startSession();
        this.session.startTransaction();
      }

      let value = await this.fn(this.session);
      for (const transform of transformers) {
        value = transform(value);
      }

      this.logger.info(this.options.referrer, {
        response: { value },
      });

      if (this.session) this.session.commitTransaction();
      return value as T;
    } catch (error) {
      if (this.session) this.session.abortTransaction();

      throw AppError.handler(this.logger, {
        referrer: this.options.referrer,
        error,
      });
    } finally {
      if (this.session) this.session.endSession();
    }
  }
}
