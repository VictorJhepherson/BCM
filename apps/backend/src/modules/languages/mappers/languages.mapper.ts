import {
  ILanguageMapper,
  Language,
  MappedLanguage,
  Mappers,
} from '@shared/models';

export class LanguageMapper implements ILanguageMapper {
  mapLanguages(documents: Language[]): MappedLanguage[] {
    return documents.map((document) => ({
      id: document._id,
      language: document.language,
    }));
  }
}

export type LanguageMapperType = Mappers<LanguageMapper>;
