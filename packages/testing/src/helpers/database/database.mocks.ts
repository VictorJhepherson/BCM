import { getConnection } from '@/helpers/database/connection/connection.mocks';
import { TMockDatabase } from './database.mocks.types';

const getMocks = (): TMockDatabase => {
  const mockConnection = getConnection();

  return { mockConnection };
};

export const database = { getMocks } as const;
export type TMockDatabaseType = typeof database;
