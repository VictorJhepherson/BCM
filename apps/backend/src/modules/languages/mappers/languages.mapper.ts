import {
  ILanguageMapper,
  Language,
  MappedLanguage,
  Mappers,
} from '@shared/models';

export class LanguageMapper implements ILanguageMapper {
  mapLanguages(languages: Language[]): MappedLanguage[] {
    return languages.map((language) => ({
      id: language._id,
      language: language.language,
    }));
  }
}

export type LanguageMapperType = Mappers<LanguageMapper>;
