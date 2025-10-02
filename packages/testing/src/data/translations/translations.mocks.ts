import { values } from '../common/common.mocks';
import {
  TranslationMock,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter,
  TranslationMockRef,
} from './translations.mocks.types';

const ref: TranslationMockRef = {
  _id: values.mongo._id,
};

const body: TranslationMockBody = {
  add: {
    active: values.translation.active,
    project: values.translation.project,
    language: values.translation.language,
    translations: values.translation.translations,
  },
  edit: {
    translations: { welcome: 'Hello World!!!' },
  },
};

const data: TranslationMockData = {
  _id: values.mongo._id,
  active: values.translation.active,
  project: values.translation.project,
  language: values.translation.language,
  translations: values.translation.translations,
  createdAt: values.mongo.createdAt,
  updatedAt: values.mongo.updatedAt,
};

const filter: TranslationMockFilter = {
  default: {
    active: true,
  },
  pagination: {
    active: true,
    ...values.filter,
  },
  controller: {
    active: true,
    ...values.filter,
  },
};

export const translation: TranslationMock = {
  ref,
  body,
  data,
  filter,
};
