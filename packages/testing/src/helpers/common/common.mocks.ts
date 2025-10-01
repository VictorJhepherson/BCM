import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { ClientSession, Connection } from 'mongoose';
import { BuilderOptions, Options } from './common.mocks.types';

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

export const getExecutorBuilder = <T>({
  data = { response: 'MOCK_RESPONSE' },
}: BuilderOptions = {}): T => {
  return {
    use: jest.fn().mockReturnThis(),
    withConnection: jest.fn().mockReturnThis(),
    withMapper: jest.fn().mockImplementation(() => getMapBuilder({ data })),
    build: jest.fn().mockImplementation(({ transformers }) => {
      if (!transformers?.length) return data;
      for (const transform of transformers) {
        data = transform(data);
      }

      return data;
    }),
  } as T;
};

export const getMapBuilder = <T>({
  data = { response: 'MOCK_RESPONSE' },
}: BuilderOptions = {}): T => {
  const mockExecutor = getExecutorBuilder<any>({ data });

  return {
    map: jest.fn().mockImplementation(() => getMapBuilder({ data })),
    filter: jest.fn().mockImplementation(() => getMapBuilder({ data })),
    build: jest
      .fn()
      .mockImplementation((options) => mockExecutor.build(options)),
  } as T;
};
