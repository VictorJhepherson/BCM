import { AddLanguageDTO, EditLanguageDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  LanguageMock,
  LanguageMockData,
  LanguageMockDTO,
  LanguageMockFilter,
} from './languages.mocks.types';

const dto: LanguageMockDTO = {
  add: Object.assign(new AddLanguageDTO(), {
    language: values.language.language,
  }),
  edit: Object.assign(new EditLanguageDTO(), {
    language: 'pt',
  }),
};

const data: LanguageMockData = {
  language: values.language.language,
};

const filter: LanguageMockFilter = {
  id: values.mongo._id,
};

export const language: LanguageMock = {
  dto,
  data,
  filter,
};
