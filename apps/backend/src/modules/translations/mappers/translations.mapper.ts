import { Injectable } from '@nestjs/common';
import {
  FlatTranslation,
  ITranslationMapper,
  MappedTranslation,
  WithPagination,
} from '@shared/models';

@Injectable()
export class TranslationMapper implements ITranslationMapper {
  mapTranslation(translation: FlatTranslation): MappedTranslation {
    return {
      id: translation._id,
      active: translation.active,
      language: translation.language,
      project: translation.project,
      translations: translation.translations,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    };
  }

  mapTranslations(
    payload: WithPagination<FlatTranslation>,
  ): WithPagination<MappedTranslation> {
    const { data, sort, pagination } = payload;

    return {
      data: data.map(this.mapTranslation),
      sort: { by: sort.by, order: sort.order },
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: Math.ceil(pagination.total / pagination.limit),
      },
    };
  }
}
