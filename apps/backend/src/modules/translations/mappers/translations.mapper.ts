import {
  ITranslationMapper,
  MappedTranslation,
  Mappers,
  PopulateTranslation,
} from '@shared/models';

export class TranslationMapper implements ITranslationMapper {
  mapTranslation(translation: PopulateTranslation): MappedTranslation {
    return {
      language: translation.languageId.language,
      translations: translation.translations,
    };
  }

  mapTranslations(translations: PopulateTranslation[]): MappedTranslation[] {
    return translations.map((translation: PopulateTranslation) =>
      this.mapTranslation(translation),
    );
  }
}

export type TranslationMapperType = Mappers<TranslationMapper>;
