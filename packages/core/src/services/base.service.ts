import { NotImplementedException } from '@nestjs/common';
import {
  ExecuteProps,
  ILoggerProvider,
  MapArg,
  MapProps,
  MapReturn,
} from '@shared/models';
import { AppError } from '../models';

export abstract class BaseService<M = never> {
  private readonly referrer: string;

  constructor(
    private readonly name: string,
    private readonly logger: ILoggerProvider,
    private readonly mapper?: M,
  ) {
    this.referrer = `${this.name}[service]`;
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
      this.logger.info(this.referrer, { response: { mapped } });

      return mapped;
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: this.referrer,
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
