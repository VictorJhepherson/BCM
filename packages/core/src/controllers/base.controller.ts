import { ExecuteProps } from '@shared/models';
import { AppError } from '../models';

export abstract class BaseController {
  constructor(private readonly name: string) {}

  protected async execute<T>({ fn }: ExecuteProps<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw AppError.handler({
        referrer: `${this.name}[controller]`,
        error,
      });
    }
  }
}
