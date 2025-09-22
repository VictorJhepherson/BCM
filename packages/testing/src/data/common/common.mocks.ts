import { ILanguage, IProject, ITranslation } from '@shared/models';
import { Types } from 'mongoose';
import { ValuesType } from './common.mocks.types';

const objectId = new Types.ObjectId();

const mongo = {
  _id: objectId,
  id: objectId.toHexString(),
};

const language: ILanguage = {
  language: 'en',
  countries: ['US', 'CA'],
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
};
