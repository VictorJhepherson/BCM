import { PopulateTranslation } from '@shared/models';
import {
  mockData,
  MockDataFactory,
  MockPropsOf,
  TranslationMock,
} from '@shared/testing';
import { TranslationMapper } from './translations.mapper';

const sort = mockData.values.filter.sort;
const pagination = mockData.values.filter.pagination;

const { data } = new MockDataFactory<TranslationMock>(
  mockData.factory.translation,
)
  .select<'data', PopulateTranslation>('data')
  .add('language', {
    _id: mockData.values.mongo._id,
    name: mockData.values.language.name,
  })
  .build();

describe('[mappers] - TranslationMapper', () => {
  const context = {} as MockPropsOf<'mapper', TranslationMapper>;

  beforeEach(() => {
    context.mapper = new TranslationMapper();
  });

  describe('[mapTranslation]', () => {
    it('should map a translation correctly', () => {
      expect(context.mapper.mapTranslation(data)).toEqual({
        id: data._id,
        active: data.active,
        language: data.language.name,
        translations: data.translations,
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
            language: data.language.name,
            translations: data.translations,
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
