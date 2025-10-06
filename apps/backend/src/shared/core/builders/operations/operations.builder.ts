import { AppError } from '@/shared/core';
import { MapBuilder } from '@/shared/core/builders/mappers/mappers.builder';
import { ILoggerProvider, TRunOptions } from '@/shared/models';

import { TPromiseFn } from '@bcm/models';
import { InternalServerErrorException } from '@nestjs/common';

import { ClientSession, Connection } from 'mongoose';
import { TExecuteOptions } from './operations.builder.types';

export class OperationBuilder<T> {
  private fn: TPromiseFn<unknown, ClientSession>;
  private session: ClientSession;
  private connection: Connection;

  constructor(
    private readonly logger: ILoggerProvider,
    private readonly options: TRunOptions,
  ) {}

  use<P>(fn: TPromiseFn<P, ClientSession>): this {
    this.fn = fn;
    return this;
  }

  useMapper<M>(mapper: M): MapBuilder<T, M> {
    return new MapBuilder<T, M>(mapper, this);
  }

  useConnection(connection: Connection): this {
    this.connection = connection;
    return this;
  }

  async execute(): Promise<T>;
  async execute({ transformers }: TExecuteOptions<T>): Promise<T>;
  async execute({ transformers = [] }: TExecuteOptions<T> = {}): Promise<T> {
    try {
      if (!this.fn) {
        throw new InternalServerErrorException({
          message:
            'Executor function (fn) is missing. The builder was not properly configured using the .use() method.',
        });
      }

      if (this.connection) {
        this.session = await this.connection.startSession();
        this.session.startTransaction();
      }

      let value = (await this.fn(this.session)) as T;
      for (const transform of transformers) {
        value = transform(value);
      }

      if (this.session) await this.session.commitTransaction();
      return value;
    } catch (error) {
      if (this.session) await this.session.abortTransaction();

      throw AppError.handler(this.logger, {
        referrer: this.options.referrer,
        error,
      });
    } finally {
      if (this.session) await this.session.endSession();
    }
  }
}
