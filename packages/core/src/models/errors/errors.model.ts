import { HttpException } from '@nestjs/common';
import { ErrorTypes, ILoggerProvider } from '@shared/models';
import { AppErrorProps, SetupPayload } from './errors.model.types';

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

  static handler({ referrer, error }: AppErrorProps): void {
    if (error instanceof AppError) throw error;

    throw new AppError({ referrer, error });
  }

  static withLogger(
    logger: ILoggerProvider,
    { referrer, error }: AppErrorProps,
  ): void {
    let appError: AppError;

    if (error instanceof AppError) appError = error;
    else appError = new AppError({ referrer, error });

    logger.error(referrer, { error: appError });
    throw appError;
  }
}
