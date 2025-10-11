import { Types } from 'mongoose';

import { TUserPayload } from '@bcm/models';
import {
  TMockDatabase,
  TMockHeaders,
  TMockPagination,
  TMockSort,
  TMockValues,
} from './common.data.mocks.types';

const objectId = new Types.ObjectId();
const mockDatabase: TMockDatabase = {
  _id: objectId,
  id: objectId.toHexString(),
  createdAt: new Date('2025-09-26T19:00:00.000Z'),
  updatedAt: new Date('2025-09-26T19:00:00.000Z'),
};

const mockSort: TMockSort = {
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  sort: { by: 'createdAt', order: 'DESC' },
};

const mockPagination: TMockPagination = {
  page: 1,
  limit: 20,
  pagination: { skip: 0, page: 1, limit: 20 },
};

const mockUser: TUserPayload = {
  name: 'John Doe',
  userId: objectId.toHexString(),
  groups: ['VIEWER', 'EDITOR', 'ADMIN'],
  scopes: ['PROJECTS', 'FLAGS', 'TRANSLATIONS'],
};

const mockHeaders: TMockHeaders = {
  country: 'US',
  language: 'en',
  authorization: 'Bearer token',
};

export const values: TMockValues = {
  user: mockUser,
  headers: mockHeaders,
  database: mockDatabase,
  sort: mockSort,
  pagination: mockPagination,
} as const;
