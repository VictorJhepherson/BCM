import { InternalServerErrorException } from '@nestjs/common';
import { ExecuteOptions, ILoggerProvider, PromiseFn } from '@shared/models';
import { AppError } from '../../models';
import { AddToProps } from './query.builder.types';

export class FacadeQueryBuilder {
  constructor(
    private readonly logger: ILoggerProvider,
    private readonly options: ExecuteOptions,
  ) {}

  use<Q, R>(fn: PromiseFn<R, Q>): QueryBuilder<Q, R> {
    return new QueryBuilder(fn, this.logger, this.options);
  }
}

class QueryBuilder<Q, T> {
  private fn: PromiseFn<T, Q>;
  private args: Partial<Q> = {};

  constructor(
    fn: PromiseFn<T, Q>,
    private readonly logger: ILoggerProvider,
    private readonly options: ExecuteOptions,
  ) {
    this.fn = fn;
  }

  addTo<K extends keyof Q>(key: K, { args }: AddToProps<Q[K]>): this {
    if (!this.args[key]) {
      this.args[key] = args as Q[K];
      return this;
    }

    const old = this.args[key];
    this.args[key] = { ...old, ...args } as Q[K];

    return this;
  }

  async build(): Promise<T> {
    try {
      if (!this.fn) {
        throw new InternalServerErrorException({
          message:
            'Query function (fn) is missing. The builder was not properly configured using the .use() method.',
        });
      }

      return await this.fn(this.args as Q);
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: this.options.referrer,
        error,
      });
    }
  }
}
