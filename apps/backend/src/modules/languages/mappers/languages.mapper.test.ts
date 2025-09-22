import { Language } from '@shared/models';
import {
  LanguageMock,
  MapperMockProps,
  mockData,
  MockDataFactory,
} from '@shared/testing';
import { LanguageMapper } from './languages.mapper';

const { data } = new MockDataFactory<LanguageMock>(mockData.factory.language)
  .select<'data', Required<Language>>('data')
  .add('_id', mockData.values.mongo._id)
  .build();

describe('[mappers] - LanguageMapper', () => {
  const context = {} as MapperMockProps<LanguageMapper>;

  beforeEach(() => {
    context.mapper = new LanguageMapper();
  });

  describe('[mapLanguages]', () => {
    it('should map languages correctly', () => {
      expect(context.mapper.mapLanguages([data])).toEqual(
        expect.arrayContaining([
          {
            id: data._id,
            language: data.language,
            countries: data.countries,
          },
        ]),
      );
    });
  });
});
