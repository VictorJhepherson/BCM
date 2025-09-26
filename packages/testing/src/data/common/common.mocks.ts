import { ILanguage, IProject, ITranslation } from '@shared/models';
import { Types } from 'mongoose';
import { MockPagination, MockSort, ValuesType } from './common.mocks.types';

const objectId = new Types.ObjectId();

const mongo = {
  _id: objectId,
  id: objectId.toHexString(),
  get: (key: string) => {
    if (key === 'createdAt') return new Date('2025-09-26T19:00:00.000Z');
    if (key === 'updatedAt') return new Date('2025-09-26T19:00:00.000Z');
  },
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
  name: 'en',
  active: true,
};

const project: IProject = {
  name: 'project-name',
  active: true,
  description: 'project-description',
};

const translation: ITranslation = {
  projectId: mongo._id,
  languageId: mongo._id,
  active: true,
  translations: { welcome: 'Hello World!' },
};

export const values: ValuesType = {
  mongo,
  project,
  language,
  translation,
  filter: { ...sort, ...pagination },
};
