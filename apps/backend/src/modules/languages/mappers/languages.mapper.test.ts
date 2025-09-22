import { Language } from '@shared/models';
import {
  MockDataFactory,
  MockLanguage,
  MockMapperProps,
  mockData,
} from '@shared/testing';
import { LanguageMapper } from './languages.mapper';

const { data } = new MockDataFactory<MockLanguage>(mockData.factory.language)
  .select<'data', Required<Language>>('data')
  .addData('_id', mockData.values.mongo._id)
  .createMock();

describe('[mappers] - LanguageMapper', () => {
  const context = {} as MockMapperProps<LanguageMapper>;

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
