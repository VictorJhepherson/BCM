import { AddLanguageDTO, EditLanguageDTO } from './languages.dtos';
import { Language, LanguageFilter, MappedLanguage } from './languages.types';

export interface ILanguage {
  language: string;
}

export interface ILanguageRepository {
  find(): Promise<Language[]>;
  create(dto: AddLanguageDTO): Promise<Language>;
  update(
    filter: LanguageFilter,
    dto: EditLanguageDTO,
  ): Promise<Language | null>;
  delete(filter: LanguageFilter): Promise<Language | null>;
}

export interface ILanguageService {
  getAll(): Promise<MappedLanguage[]>;
  addLanguage(dto: AddLanguageDTO): Promise<Language>;
  editLanguage(filter: LanguageFilter, dto: EditLanguageDTO): Promise<Language>;
  deleteLanguage(filter: LanguageFilter): Promise<void>;
}

export interface ILanguageController {
  getAll(): Promise<MappedLanguage[]>;
  addLanguage(dto: AddLanguageDTO): Promise<Language>;
  editLanguage(
    id: LanguageFilter['id'],
    dto: EditLanguageDTO,
  ): Promise<Language>;
  deleteLanguage(id: LanguageFilter['id']): Promise<void>;
}

export interface ILanguageMapper {
  mapLanguages(languages: Language[]): MappedLanguage[];
}
