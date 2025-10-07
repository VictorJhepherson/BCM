import { ITranslationMapper } from '@/modules/translations/models';

import {
  TFlatTranslation,
  TMappedTranslation,
  TWithPagination,
} from '@bcm/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslationMapper implements ITranslationMapper {
  mapTranslation(translation: TFlatTranslation): TMappedTranslation {
    return {
      id: translation._id,
      active: translation.active,
      locale: translation.locale,
      status: translation.status,
      project: translation.project,
      translations: translation.translations,
      drafts: translation.drafts,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    };
  }

  mapTranslations(
    payload: TWithPagination<TFlatTranslation>,
  ): TWithPagination<TMappedTranslation> {
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
