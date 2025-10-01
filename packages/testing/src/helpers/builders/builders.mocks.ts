import { getExecutorBuilder, getMapBuilder } from '../common/common.mocks';
import { BuilderMock, BuildersMockProps } from './builder.mocks.types';

const getMocks = <E, M = never>({
  map,
  executor,
}: BuildersMockProps = {}): BuilderMock<E, M> => {
  const mockMap = getMapBuilder<M>(map);
  const mockExecutor = getExecutorBuilder<E>(executor);

  return { mockMap, mockExecutor };
};

export const builders = { getMocks } as const;
export type MockBuilderype = typeof builders;
