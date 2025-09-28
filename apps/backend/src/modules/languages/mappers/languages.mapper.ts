import {
  FlatLanguage,
  ILanguageMapper,
  LanguagePayload,
  MappedLanguage,
  Mappers,
  WithPagination,
} from '@shared/models';

export class LanguageMapper implements ILanguageMapper {
  mapLanguage(language: FlatLanguage): LanguagePayload {
    return {
      id: language._id,
      name: language.name,
      active: language.active,
      createdAt: language.createdAt,
      updatedAt: language.updatedAt,
    };
  }

  mapLanguages(payload: WithPagination<FlatLanguage>): MappedLanguage {
    const { data, sort, pagination } = payload;

    return {
      data: data.map((language: FlatLanguage) => this.mapLanguage(language)),
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
