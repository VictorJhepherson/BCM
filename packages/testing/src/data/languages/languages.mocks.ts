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
  add: {
    active: values.language.active,
    name: values.language.name,
  },
  edit: {
    name: 'pt',
  },
  archive: {
    active: false,
  },
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
