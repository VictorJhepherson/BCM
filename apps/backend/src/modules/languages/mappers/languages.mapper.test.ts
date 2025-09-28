import { Language } from '@shared/models';
import {
  LanguageMock,
  mockData,
  MockDataFactory,
  MockPropsOf,
} from '@shared/testing';
import { LanguageMapper } from './languages.mapper';

const sort = mockData.values.filter.sort;
const pagination = mockData.values.filter.pagination;

const { data } = new MockDataFactory<LanguageMock>(mockData.factory.language)
  .select<'data', Required<Language>>('data')
  .build();

describe('[mappers] - LanguageMapper', () => {
  const context = {} as MockPropsOf<'mapper', LanguageMapper>;

  beforeEach(() => {
    context.mapper = new LanguageMapper();
  });

  describe('[mapLanguage]', () => {
    it('should map a language correctly', () => {
      expect(context.mapper.mapLanguage(data)).toEqual({
        id: data._id,
        name: data.name,
        active: data.active,
        createdAt: data.get('createdAt'),
        updatedAt: data.get('updatedAt'),
      });
    });
  });

  describe('[mapLanguages]', () => {
    it('should map languages correctly', () => {
      expect(
        context.mapper.mapLanguages({
          data: [data],
          sort: { ...sort },
          pagination: { ...pagination, total: 100 },
        }),
      ).toEqual({
        data: expect.arrayContaining([
          {
            id: data._id,
            name: data.name,
            active: data.active,
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
