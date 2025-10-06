import { builders } from '@/helpers/builders/builders.mocks';
import { database } from '@/helpers/database/database.mocks';
import { nestjs } from '@/helpers/nestjs/nestjs.mocks';

export {
  MockEnum,
  TestLogger,
  TestMapper,
} from '@/helpers/common/common.mocks';

export { type TMockBuilderType } from '@/helpers/builders/builders.mocks';
export { type TMockDatabaseType } from '@/helpers/database/database.mocks';
export { type TMockNestjsType } from '@/helpers/nestjs/nestjs.mocks';

export {
  type TMockDataMap,
  type TMockDataMaps,
} from '@/helpers/common/common.mocks.types';

export const mockHelpers = { database, builders, nestjs };
