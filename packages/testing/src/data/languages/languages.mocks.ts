import { LanguageAddDTO, LanguageEditDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  LanguageMock,
  LanguageMockData,
  LanguageMockDTO,
  LanguageMockFilter,
} from './languages.mocks.types';

const dto: LanguageMockDTO = {
  add: Object.assign(new LanguageAddDTO(), {
    name: values.language.name,
  }),
  edit: Object.assign(new LanguageEditDTO(), {
    name: 'pt',
  }),
};

const data: LanguageMockData = {
  name: values.language.name,
};

const filter: LanguageMockFilter = {
  _id: values.mongo._id,
};

export const language: LanguageMock = {
  dto,
  data,
  filter,
};
