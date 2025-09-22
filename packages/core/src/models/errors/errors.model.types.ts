import { ErrorTypes } from '@shared/models';

export type AppErrorProps = {
  referrer: string;
  error: ErrorTypes;
};

export type SetupPayload = {
  status: number;
  message: string;
};
