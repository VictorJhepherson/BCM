import {
  ILanguageMapper,
  Language,
  MappedLanguage,
  Mappers,
  WithPagination,
} from '@shared/models';

export class LanguageMapper implements ILanguageMapper {
  mapLanguages(payload: WithPagination<Language>): MappedLanguage {
    const { data, sort, pagination } = payload;

    return {
      data: data.map((language: Language) => ({
        id: language._id,
        name: language.name,
      })),
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
