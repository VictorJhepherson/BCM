import { PopulateTranslation } from '@shared/models';
import {
  mockData,
  MockDataFactory,
  MockMapperProps,
  MockTranslation,
} from '@shared/testing';
import { TranslationMapper } from './translations.mapper';

const { data } = new MockDataFactory<MockTranslation>(
  mockData.factory.translation,
)
  .select<'data', PopulateTranslation>('data')
  .addData('languageId', {
    _id: mockData.values.mongo._id,
    language: mockData.values.language.language,
  })
  .createMock();

describe('[mappers] - TranslationMapper', () => {
  const context = {} as MockMapperProps<TranslationMapper>;

  beforeEach(() => {
    context.mapper = new TranslationMapper();
  });

  describe('[mapTranslation]', () => {
    it('should map translation correctly', () => {
      expect(context.mapper.mapTranslation(data)).toEqual({
        language: data.languageId.language,
        translations: data.translations,
      });
    });
  });

  describe('[mapTranslations]', () => {
    it('should map translations correctly', () => {
      expect(context.mapper.mapTranslations([data])).toEqual(
        expect.arrayContaining([
          {
            language: data.languageId.language,
            translations: data.translations,
          },
        ]),
      );
    });
  });
});
