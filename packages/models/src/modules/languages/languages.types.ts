import { HydratedDocument, Types } from 'mongoose';
import { ILanguage } from './languages.interfaces';
import { LanguageEntity } from './languages.schemas';

export type Language = HydratedDocument<LanguageEntity>;

export type LanguageFilter = {
  _id: Types.ObjectId;
};

export type MappedLanguage = ILanguage & {
  id: Types.ObjectId;
};
