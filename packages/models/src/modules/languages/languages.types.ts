import { HydratedDocument, Types } from 'mongoose';
import { WithPagination } from '../..';
import { ILanguage } from './languages.interfaces';
import { LanguageEntity } from './languages.schemas';

export type Language = HydratedDocument<LanguageEntity>;

type LanguagePayload = ILanguage & {
  id: Types.ObjectId;
};

export type MappedLanguage = WithPagination<LanguagePayload>;
