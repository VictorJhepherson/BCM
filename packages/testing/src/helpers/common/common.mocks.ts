import { TRequestOptions } from '@/models';
import { ArgumentsHost, ExecutionContext } from '@nestjs/common';

import { TMockDataMap, TMockDataMaps } from './common.mocks.types';

export enum MockEnum {
  VALUE_A = 'a',
  VALUE_B = 'b',
}

export class TestLogger {
  info = jest.fn();
  warn = jest.fn();
  error = jest.fn();
  debug = jest.fn();
}

export class TestMapper {
  mapTest(data: TMockDataMap): string {
    return Object.values(data)[0] || '';
  }

  mapTests(payload: TMockDataMaps): string[] {
    const { data } = payload;
    return data.map((item) => this.mapTest(item));
  }

  mapValues(data: TMockDataMap[]): string[] {
    return data.map((item) => this.mapTest(item));
  }
}

export const getArgumentsHost = <T = ArgumentsHost>({
  req = {},
  res = {},
}: TRequestOptions = {}): T => {
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
}: TRequestOptions = {}): T => {
  const argsHost = getArgumentsHost({ req, res });

  return {
    ...argsHost,
    getClass: jest.fn(),
    getHandler: jest.fn(),
  } as T;
};
