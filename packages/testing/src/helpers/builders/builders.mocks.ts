import { getMapBuilder } from '@/helpers/builders/mapper/mapper.mocks';
import { getOperationBuilder } from '@/helpers/builders/operation/operation.mocks';
import { TBuilderMockProps, TMockBuilder } from './builders.mocks.types';

const getMocks = <E, M = never>({
  map,
  operation,
}: TBuilderMockProps = {}): TMockBuilder<E, M> => {
  const mockMap = getMapBuilder<M>(map);
  const mockOperation = getOperationBuilder<E>(operation);

  return { mockMap, mockOperation };
};

export const builders = { getMocks } as const;
export type TMockBuilderType = typeof builders;
