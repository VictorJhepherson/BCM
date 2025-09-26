import { PopulateTranslation } from '@shared/models';
import {
  MapperMockProps,
  mockData,
  MockDataFactory,
  TranslationMock,
} from '@shared/testing';
import { TranslationMapper } from './translations.mapper';

const sort = mockData.values.filter.sort;
const pagination = mockData.values.filter.pagination;

const { data } = new MockDataFactory<TranslationMock>(
  mockData.factory.translation,
)
  .select<'data', PopulateTranslation>('data')
  .add('languageId', {
    _id: mockData.values.mongo._id,
    name: mockData.values.language.name,
  })
  .build();

describe('[mappers] - TranslationMapper', () => {
  const context = {} as MapperMockProps<TranslationMapper>;

  beforeEach(() => {
    context.mapper = new TranslationMapper();
  });

  describe('[mapTranslation]', () => {
    it('should map a translation correctly', () => {
      expect(context.mapper.mapTranslation(data)).toEqual({
        id: data._id,
        active: data.active,
        language: data.languageId.name,
        translations: data.translations,
        createdAt: data.get('createdAt'),
        updatedAt: data.get('updatedAt'),
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
            language: data.languageId.name,
            translations: data.translations,
            createdAt: data.get('createdAt'),
            updatedAt: data.get('updatedAt'),
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
