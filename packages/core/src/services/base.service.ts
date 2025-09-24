import { NotImplementedException } from '@nestjs/common';
import { ExecuteProps, MapArg, MapProps, MapReturn } from '@shared/models';
import { AppError } from '../models';

export abstract class BaseService<M = never> {
  constructor(
    private readonly name: string,
    private readonly mapper?: M,
  ) {}

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
      const response = await fn();

      if (!mapKey) return response;
      return this.map({ key: mapKey, data: response as MapArg<M[K]> });
    } catch (error) {
      throw AppError.handler({
        referrer: `${this.name}[service]`,
        error,
      });
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
