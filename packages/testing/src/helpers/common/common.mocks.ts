import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
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
