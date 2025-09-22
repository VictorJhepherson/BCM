import { AddLanguageDTO, EditLanguageDTO } from './languages.dtos';
import { Language, LanguageFilter, MappedLanguage } from './languages.types';

export interface ILanguage {
  language: string;
  countries: string[];
}

export interface ILanguageRepository {
  getAll(): Promise<Language[]>;
  addLanguage(dto: AddLanguageDTO): Promise<Language>;
  editLanguage(filter: LanguageFilter, dto: EditLanguageDTO): Promise<Language>;
  removeLanguage(filter: LanguageFilter): Promise<void>;
}

export interface ILanguageService {
  getAll(): Promise<MappedLanguage[]>;
  addLanguage(dto: AddLanguageDTO): Promise<Language>;
  editLanguage(filter: LanguageFilter, dto: EditLanguageDTO): Promise<Language>;
  removeLanguage(filter: LanguageFilter): Promise<void>;
}

export interface ILanguageController {
  getAll(): Promise<MappedLanguage[]>;
  addLanguage(dto: AddLanguageDTO): Promise<Language>;
  editLanguage(
    id: LanguageFilter['id'],
    dto: EditLanguageDTO,
  ): Promise<Language>;
  removeLanguage(id: LanguageFilter['id']): Promise<void>;
}

export interface ILanguageMapper {
  mapLanguages(documents: Language[]): MappedLanguage[];
}
