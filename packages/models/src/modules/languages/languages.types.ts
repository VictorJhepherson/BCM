import { HydratedDocument } from 'mongoose';
import { WithId, WithLean, WithPagination } from '../..';
import { LanguageEntity } from './languages.schemas';

export type Language = HydratedDocument<LanguageEntity>;
export type FlatLanguage = WithLean<LanguageEntity>;

export type LanguagePayload = WithId<FlatLanguage>;
export type MappedLanguage = WithPagination<LanguagePayload>;
