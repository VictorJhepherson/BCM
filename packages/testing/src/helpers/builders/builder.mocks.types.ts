import { BuilderOptions } from '../common/common.mocks.types';

export type BuildersMockProps = {
  map?: BuilderOptions;
  executor?: BuilderOptions;
};

export type BuilderMock<E, M> = {
  mockMap: M;
  mockExecutor: E;
};
