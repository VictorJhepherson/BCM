import {
  ILanguageMapper,
  Language,
  LanguagePayload,
  MappedLanguage,
  Mappers,
  WithPagination,
} from '@shared/models';

export class LanguageMapper implements ILanguageMapper {
  mapLanguage(language: Language): LanguagePayload {
    return {
      id: language._id,
      name: language.name,
    };
  }

  mapLanguages(payload: WithPagination<Language>): MappedLanguage {
    const { data, sort, pagination } = payload;

    return {
      data: data.map((language: Language) => this.mapLanguage(language)),
      sort: { by: sort.by, order: sort.order },
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: Math.ceil(pagination.total / pagination.limit),
      },
    };
  }
}

export type LanguageMapperType = Mappers<LanguageMapper>;
