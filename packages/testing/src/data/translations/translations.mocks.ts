import { AddTranslationDTO, EditTranslationDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  TranslationMock,
  TranslationMockData,
  TranslationMockDTO,
  TranslationMockFilter,
} from './translations.mocks.types';

const dto: TranslationMockDTO = {
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
  projectId: values.translation.projectId,
  languageId: values.translation.languageId,
};

export const translation: TranslationMock = {
  dto,
  data,
  filter,
};
