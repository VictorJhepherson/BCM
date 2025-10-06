import { HttpException } from '@nestjs/common';

import { ILoggerProvider } from '@/shared/models';
import {
  TAppErrorData,
  TAppErrorProps,
  TErrorTypes,
} from './base.exception.types';

export class AppError extends Error {
  readonly status: number;
  readonly message: string;
  readonly referrer: string;

  constructor({ referrer, error }: TAppErrorProps) {
    super();

    const { status, message } = AppError.setup(error);

    this.status = status;
    this.message = message;
    this.referrer = referrer;
  }

  private static setup(error: TErrorTypes): TAppErrorData {
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

  static handler(
    logger: ILoggerProvider,
    { referrer, error }: TAppErrorProps,
  ): void {
    let appError: AppError;

    if (error instanceof AppError) appError = error;
    else appError = new AppError({ referrer, error });

    logger.error(referrer, { error: appError });
    throw appError;
  }
}
