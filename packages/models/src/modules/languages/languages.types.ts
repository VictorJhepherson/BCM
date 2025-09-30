import { HydratedDocument } from 'mongoose';
import { WithId, WithLean } from '../..';
import { LanguageEntity } from './languages.schemas';

export type Language = HydratedDocument<LanguageEntity>;
export type FlatLanguage = WithLean<LanguageEntity>;

export type MappedLanguage = WithId<FlatLanguage>;
