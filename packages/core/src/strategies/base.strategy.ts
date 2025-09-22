import { NotImplementedException } from '@nestjs/common';
import { MapProps, MapReturn, PromiseFn } from '@shared/models';
import { AppError } from '../models';

export abstract class BaseStrategy<M = never> {
  constructor(
    private readonly name: string,
    protected readonly mapper?: M,
  ) {}

  protected map<K extends keyof M>({
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

  protected async execute<T>(fn: PromiseFn<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw AppError.handler({
        referrer: `${this.name}[strategy]`,
        error,
      });
    }
  }
}
