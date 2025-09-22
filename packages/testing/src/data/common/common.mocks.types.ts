import { ILanguage, IProject, ITranslation } from '@shared/models';
import { Types } from 'mongoose';

type MongoType = {
  id: string;
  _id: Types.ObjectId;
};

export type ValuesType = {
  mongo: MongoType;
  project: IProject;
  language: ILanguage;
  translation: ITranslation;
};

export type DataMock<T, D, F> = {
  dto: T;
  data: D;
  filter: F;
};
