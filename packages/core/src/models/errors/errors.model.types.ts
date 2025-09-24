import { ErrorTypes, ILoggerProvider } from '@shared/models';

export type WithLogger = {
  logger: ILoggerProvider;
};

export type AppErrorProps = {
  referrer: string;
  error: ErrorTypes;
};

export type SetupPayload = {
  status: number;
  message: string;
};
