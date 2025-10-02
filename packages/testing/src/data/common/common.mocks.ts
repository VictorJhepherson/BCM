import { ILanguage, IProject, ITranslation } from '@shared/models';
import { Types } from 'mongoose';
import { MockPagination, MockSort, ValuesType } from './common.mocks.types';

const objectId = new Types.ObjectId();

const mongo = {
  _id: objectId,
  id: objectId.toHexString(),
  createdAt: new Date('2025-09-26T19:00:00.000Z'),
  updatedAt: new Date('2025-09-26T19:00:00.000Z'),
};

const sort: MockSort = {
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  sort: { by: 'createdAt', order: 'DESC' },
};

const pagination: MockPagination = {
  page: 1,
  limit: 20,
  pagination: { skip: 0, page: 1, limit: 20 },
};

const language: ILanguage = {
  active: true,
  name: 'en',
};

const project: IProject = {
  active: true,
  name: 'project-name',
  description: 'project-description',
  languages: ['en', 'es', 'fr', 'pt'],
};

const translation: ITranslation = {
  active: true,
  project: mongo._id,
  language: mongo._id,
  translations: { welcome: 'Hello World!' },
};

export const values: ValuesType = {
  mongo,
  project,
  language,
  translation,
  filter: { ...sort, ...pagination },
};
