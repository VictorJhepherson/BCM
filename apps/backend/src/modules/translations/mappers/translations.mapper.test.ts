import { PopulateTranslation } from '@shared/models';
import {
  MapperMockProps,
  mockData,
  MockDataFactory,
  TranslationMock,
} from '@shared/testing';
import { TranslationMapper } from './translations.mapper';

const { data } = new MockDataFactory<TranslationMock>(
  mockData.factory.translation,
)
  .select<'data', PopulateTranslation>('data')
  .add('languageId', {
    _id: mockData.values.mongo._id,
    language: mockData.values.language.language,
  })
  .build();

describe('[mappers] - TranslationMapper', () => {
  const context = {} as MapperMockProps<TranslationMapper>;

  beforeEach(() => {
    context.mapper = new TranslationMapper();
  });

  describe('[mapTranslation]', () => {
    it('should map translation correctly', () => {
      expect(context.mapper.mapTranslation(data)).toEqual({
        language: mockData.values.language.language,
        translations: mockData.values.translation.translations,
      });
    });
  });

  describe('[mapTranslations]', () => {
    it('should map translations correctly', () => {
      expect(context.mapper.mapTranslations([data])).toEqual(
        expect.arrayContaining([
          {
            language: mockData.values.language.language,
            translations: mockData.values.translation.translations,
          },
        ]),
      );
    });
  });
});
