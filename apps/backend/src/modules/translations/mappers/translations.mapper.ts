import {
  ITranslationMapper,
  MappedTranslation,
  Mappers,
  PopulateTranslation,
} from '@shared/models';

export class TranslationMapper implements ITranslationMapper {
  mapTranslation(document: PopulateTranslation): MappedTranslation {
    return {
      language: document.languageId.language,
      translations: document.translations,
    };
  }

  mapTranslations(documents: PopulateTranslation[]): MappedTranslation[] {
    return documents.map((document: PopulateTranslation) =>
      this.mapTranslation(document),
    );
  }
}

export type TranslationMapperType = Mappers<TranslationMapper>;
