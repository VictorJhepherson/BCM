import { ExecutionContext } from '@nestjs/common';

export type GuardMock = {
  mockContext: ExecutionContext;
};
