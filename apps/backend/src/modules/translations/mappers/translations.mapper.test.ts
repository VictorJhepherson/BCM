import { TFlatTranslation } from '@bcm/models';
import {
  MockDataFactory,
  TMockPropsOf,
  TMockTranslation,
  mockData,
} from '@bcm/testing';

import { TranslationMapper } from './translations.mapper';

const sort = mockData.filter.sort;
const pagination = mockData.filter.pagination;

const { data } = new MockDataFactory<TMockTranslation>(mockData.translation)
  .select<'data', Required<TFlatTranslation>>('data')
  .build();

describe('[mappers] - TranslationMapper', () => {
  const context = {} as TMockPropsOf<'mapper', TranslationMapper>;

  beforeEach(() => {
    context.mapper = new TranslationMapper();
  });

  describe('[mapTranslation]', () => {
    it('should map a translation correctly', () => {
      expect(context.mapper.mapTranslation(data)).toEqual({
        id: data._id,
        active: data.active,
        locale: data.locale,
        status: data.status,
        project: data.project,
        translations: data.translations,
        drafts: data.drafts,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
  });

  describe('[mapTranslations]', () => {
    it('should map translations correctly', () => {
      expect(
        context.mapper.mapTranslations({
          data: [data],
          sort: { ...sort },
          pagination: { ...pagination, total: 100 },
        }),
      ).toEqual({
        data: expect.arrayContaining([
          {
            id: data._id,
            active: data.active,
            locale: data.locale,
            status: data.status,
            project: data.project,
            translations: data.translations,
            drafts: data.drafts,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
        ]),
        sort: { by: sort.by, order: sort.order },
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: 5,
        },
      });
    });
  });
});
