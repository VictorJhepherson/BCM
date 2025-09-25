import { Language } from '@shared/models';
import {
  LanguageMock,
  MapperMockProps,
  mockData,
  MockDataFactory,
} from '@shared/testing';
import { LanguageMapper } from './languages.mapper';

const sort = mockData.values.filter.sort;
const pagination = mockData.values.filter.pagination;

const { data } = new MockDataFactory<LanguageMock>(mockData.factory.language)
  .select<'data', Required<Language>>('data')
  .build();

describe('[mappers] - LanguageMapper', () => {
  const context = {} as MapperMockProps<LanguageMapper>;

  beforeEach(() => {
    context.mapper = new LanguageMapper();
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
        data: expect.arrayContaining([{ id: data._id, name: data.name }]),
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
