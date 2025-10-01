import { Injectable } from '@nestjs/common';
import {
  ITranslationMapper,
  MappedTranslation,
  PopulateTranslation,
  WithPagination,
} from '@shared/models';

@Injectable()
export class TranslationMapper implements ITranslationMapper {
  mapTranslation(translation: PopulateTranslation): MappedTranslation {
    return {
      id: translation._id,
      active: translation.active,
      language: translation.language.name,
      translations: translation.translations,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    };
  }

  mapTranslations(
    payload: WithPagination<PopulateTranslation>,
  ): WithPagination<MappedTranslation> {
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
