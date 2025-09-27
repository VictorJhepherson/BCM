import { values } from '../common/common.mocks';
import {
  TranslationMock,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter,
  TranslationMockRef,
} from './translations.mocks.types';

const ref: TranslationMockRef = {
  project: values.translation.project,
  language: values.translation.language,
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
  get: values.mongo.get,
  active: values.translation.active,
  project: values.translation.project,
  language: values.translation.language,
  translations: values.translation.translations,
};

const filter: TranslationMockFilter = {
  ...values.filter,
};

export const translation: TranslationMock = {
  ref,
  body,
  data,
  filter,
};
