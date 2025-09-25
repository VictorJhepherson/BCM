import { ILanguage, IProject, ITranslation } from '@shared/models';
import { Types } from 'mongoose';
import { MockPagination, MockSort, ValuesType } from './common.mocks.types';

const objectId = new Types.ObjectId();

const mongo = {
  _id: objectId,
  id: objectId.toHexString(),
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
};

const project: IProject = {
  name: 'project-name',
  description: 'project-description',
};

const translation: ITranslation = {
  projectId: mongo._id,
  languageId: mongo._id,
  translations: { welcome: 'Hello World!' },
};

export const values: ValuesType = {
  mongo,
  project,
  language,
  translation,
  filter: { ...sort, ...pagination },
};
