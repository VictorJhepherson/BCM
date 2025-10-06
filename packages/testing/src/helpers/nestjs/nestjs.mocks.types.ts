import { ArgumentsHost, ExecutionContext } from '@nestjs/common';

export type TMockHost = {
  json: jest.Mock;
  status: jest.Mock;
  arguments: ArgumentsHost;
};

export type TMockNestjs = {
  mockHost: TMockHost;
  mockContext: ExecutionContext;
};
