import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { ClientSession, Connection } from 'mongoose';
import { Options } from './common.mocks.types';

export const getArgumentsHost = <T = ArgumentsHost>({
  req = {},
  res = {},
}: Options = {}): T => {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getNext: jest.fn(),
      getRequest: jest.fn().mockReturnValue(req),
      getResponse: jest.fn().mockReturnValue(res),
    }),
  } as T;
};

export const getExecutionContext = <T = ExecutionContext>({
  req = {},
  res = {},
}: Options = {}): T => {
  const argsHost = getArgumentsHost({ req, res });

  return {
    ...argsHost,
    getHandler: jest.fn(),
  } as T;
};

export const getConnection = <T = Connection>(): T => {
  return {
    startSession: jest.fn().mockResolvedValue({
      endSession: jest.fn(),
      abortTransaction: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    } as unknown as ClientSession),
  } as T;
};
