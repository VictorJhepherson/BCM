import { AddTranslationDTO, EditTranslationDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  TranslationMock,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter,
  TranslationMockRef,
} from './translations.mocks.types';

const ref: TranslationMockRef = {
  projectId: values.translation.projectId,
  languageId: values.translation.languageId,
};

const body: TranslationMockBody = {
  add: Object.assign(new AddTranslationDTO(), {
    projectId: values.translation.projectId,
    languageId: values.translation.languageId,
    translations: values.translation.translations,
  }),
  edit: Object.assign(new EditTranslationDTO(), {
    translations: { welcome: 'Hello World!!!' },
  }),
};

const data: TranslationMockData = {
  projectId: values.translation.projectId,
  languageId: values.translation.languageId,
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
