import { getExecutionContext } from '../common/common.mocks';
import { Options } from '../common/common.mocks.types';
import { GuardMock } from './guards.mocks.types';

const getMocks = ({ req, res }: Options = {}): GuardMock => {
  const mockContext = getExecutionContext({ req, res });

  return { mockContext };
};

export const guards = { getMocks } as const;
export type MockGuardType = typeof guards;
