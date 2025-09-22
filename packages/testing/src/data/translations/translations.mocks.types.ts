import {
  AddTranslationDTO,
  EditTranslationDTO,
  Translation,
} from '@shared/models';
import { Types } from 'mongoose';
import { MockData } from '../common/common.mocks.types';

export type MockTranslationData = Partial<Translation>;
export type MockTranslationDTO = {
  add: AddTranslationDTO;
  edit: EditTranslationDTO;
};

export type MockTranslationFilter = {
  projectId: Types.ObjectId;
  languageId: Types.ObjectId;
};

export type MockTranslation = MockData<
  MockTranslationDTO,
  MockTranslationData,
  MockTranslationFilter
>;
