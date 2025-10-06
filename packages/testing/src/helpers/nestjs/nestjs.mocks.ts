import {
  getArgumentsHost,
  getExecutionContext,
} from '@/helpers/common/common.mocks';
import { TRequestOptions } from '@/models';

import { TMockHost, TMockNestjs } from './nestjs.mocks.types';

const getMocks = ({
  req = { method: 'get', url: '/test' },
  res,
}: TRequestOptions = {}): TMockNestjs => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  const mockArguments = getArgumentsHost({
    req,
    res: { status: mockStatus, ...res },
  });

  const mockHost: TMockHost = {
    json: mockJson,
    status: mockStatus,
    arguments: mockArguments,
  };

  return { mockHost, mockContext: getExecutionContext({ req, res }) };
};

export const nestjs = { getMocks } as const;
export type TMockNestjsType = typeof nestjs;
