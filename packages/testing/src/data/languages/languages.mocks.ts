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
    active: values.language.active,
  }),
  edit: Object.assign(new LanguageEditDTO(), {
    active: false,
  }),
};

const data: LanguageMockData = {
  _id: values.mongo._id,
  get: values.mongo.get,
  name: values.language.name,
  active: values.language.active,
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
