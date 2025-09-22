import { AddLanguageDTO, EditLanguageDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  MockLanguage,
  MockLanguageData,
  MockLanguageDTO,
  MockLanguageFilter,
} from './languages.mocks.types';

const dto: MockLanguageDTO = {
  add: Object.assign(new AddLanguageDTO(), {
    language: values.language.language,
    countries: values.language.countries,
  }),
  edit: Object.assign(new EditLanguageDTO(), {
    countries: ['US', 'CA', 'GB'],
  }),
};

const data: MockLanguageData = {
  language: values.language.language,
  countries: values.language.countries,
};

const filter: MockLanguageFilter = {
  id: values.mongo._id,
};

export const language: MockLanguage = {
  dto,
  data,
  filter,
};
