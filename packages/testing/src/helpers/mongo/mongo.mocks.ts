import { getConnection } from '../common/common.mocks';
import { MongoMock } from './mongo.mocks.types';

const getMocks = (): MongoMock => {
  const mockConnection = getConnection();

  return { mockConnection };
};

export const mongo = { getMocks } as const;
export type MockMongoType = typeof mongo;
