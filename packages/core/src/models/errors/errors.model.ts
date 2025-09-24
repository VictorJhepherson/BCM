import { HttpException } from '@nestjs/common';
import { ErrorTypes } from '@shared/models';
import { AppErrorProps, SetupPayload, WithLogger } from './errors.model.types';

export class AppError extends Error {
  readonly status: number;
  readonly message: string;
  readonly referrer: string;

  constructor({ referrer, error }: AppErrorProps) {
    super();

    const { status, message } = AppError.setup(error);

    this.status = status;
    this.message = message;
    this.referrer = referrer;
  }

  private static setup(error: ErrorTypes): SetupPayload {
    if (error instanceof HttpException) {
      return {
        status: error.getStatus(),
        message: error.message,
      };
    }

    if (error instanceof Error) {
      return {
        status: 500,
        message: error.message,
      };
    }

    return { status: 500, message: 'Internal Server Error' };
  }

  static handler({
    referrer,
    logger,
    error,
  }: AppErrorProps & WithLogger): void {
    const appError =
      error instanceof AppError ? error : new AppError({ referrer, error });

    logger.error(referrer, { error: appError });
    throw appError;
  }
}
