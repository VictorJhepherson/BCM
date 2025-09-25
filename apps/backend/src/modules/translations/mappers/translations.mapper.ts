import {
  ITranslationMapper,
  MappedTranslation,
  Mappers,
  PopulateTranslation,
  TranslationPayload,
  WithPagination,
} from '@shared/models';

export class TranslationMapper implements ITranslationMapper {
  mapTranslation(translation: PopulateTranslation): TranslationPayload {
    return {
      language: translation.languageId.name,
      translations: translation.translations,
    };
  }

  mapTranslations(
    payload: WithPagination<PopulateTranslation>,
  ): MappedTranslation {
    const { data, sort, pagination } = payload;

    return {
      data: data.map((translation: PopulateTranslation) =>
        this.mapTranslation(translation),
      ),
      sort: { by: sort.by, order: sort.order },
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: Math.ceil(pagination.total / pagination.limit),
      },
    };
  }
}

export type TranslationMapperType = Mappers<TranslationMapper>;
