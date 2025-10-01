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
  name: values.language.name,
  active: values.language.active,
  createdAt: values.mongo.createdAt,
  updatedAt: values.mongo.updatedAt,
};

const filter: LanguageMockFilter = {
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

export const language: LanguageMock = {
  ref,
  body,
  data,
  filter,
};
