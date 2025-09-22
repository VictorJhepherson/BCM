import { AddTranslationDTO, EditTranslationDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  MockTranslation,
  MockTranslationData,
  MockTranslationDTO,
  MockTranslationFilter,
} from './translations.mocks.types';

const dto: MockTranslationDTO = {
  add: Object.assign(new AddTranslationDTO(), {
    projectId: values.translation.projectId,
    languageId: values.translation.languageId,
    translations: values.translation.translations,
  }),
  edit: Object.assign(new EditTranslationDTO(), {
    translations: { welcome: 'Hello World!!!' },
  }),
};

const data: MockTranslationData = {
  projectId: values.translation.projectId,
  languageId: values.translation.languageId,
  translations: values.translation.translations,
};

const filter: MockTranslationFilter = {
  projectId: values.translation.projectId,
  languageId: values.translation.languageId,
};

export const translation: MockTranslation = {
  dto,
  data,
  filter,
};
