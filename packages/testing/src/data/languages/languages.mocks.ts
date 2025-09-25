import { LanguageAddDTO, LanguageEditDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  LanguageMock,
  LanguageMockBody,
  LanguageMockData,
  LanguageMockFilter,
  LanguageMockRef,
} from './languages.mocks.types';

const ref: LanguageMockRef = {
  _id: values.mongo._id,
};

const body: LanguageMockBody = {
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
  ...values.filter,
};

export const language: LanguageMock = {
  ref,
  body,
  data,
  filter,
};
