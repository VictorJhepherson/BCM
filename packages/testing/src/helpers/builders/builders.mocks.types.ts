import {
  TMockDataMap,
  TMockDataMaps,
} from '@/helpers/common/common.mocks.types';

export type TBuilderOptions = {
  response?: TMockDataMap | TMockDataMaps | string[];
};

export type TBuilderMockProps = {
  map?: TBuilderOptions;
  operation?: TBuilderOptions;
};

export type TMockBuilder<E, M> = {
  mockMap: M;
  mockOperation: E;
};
