import { PromiseFn } from '@shared/models';
import { AppError } from '../models';

export abstract class BaseGateway {
  constructor(private readonly name: string) {}

  protected async execute<T>(fn: PromiseFn<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw AppError.handler({
        referrer: `${this.name}[gateway]`,
        error,
      });
    }
  }
}
