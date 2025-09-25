import {
  ILanguage,
  IPagination,
  IPaginationFilter,
  IProject,
  ITranslation,
} from '@shared/models';
import { Types } from 'mongoose';

type MongoType = {
  id: string;
  _id: Types.ObjectId;
};

export type MockSort = Pick<IPagination, 'sortBy' | 'sortOrder'> &
  Pick<IPaginationFilter, 'sort'>;

export type MockPagination = Pick<IPagination, 'page' | 'limit'> &
  Pick<IPaginationFilter, 'pagination'>;

export type ValuesType = {
  mongo: MongoType;
  project: IProject;
  language: ILanguage;
  translation: ITranslation;
  filter: MockSort & MockPagination;
};

export type DataMock<R, B, D, F> = {
  ref: R;
  body: B;
  data: D;
  filter: F;
};
