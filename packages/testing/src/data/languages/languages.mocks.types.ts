import { AddLanguageDTO, EditLanguageDTO, Language } from '@shared/models';
import { Types } from 'mongoose';
import { MockData } from '../common/common.mocks.types';

export type MockLanguageData = Partial<Language>;
export type MockLanguageDTO = {
  add: AddLanguageDTO;
  edit: EditLanguageDTO;
};

export type MockLanguageFilter = {
  id: Types.ObjectId;
};

export type MockLanguage = MockData<
  MockLanguageDTO,
  MockLanguageData,
  MockLanguageFilter
>;
