import { values } from './common/common.mocks';
import { language } from './languages/languages.mocks';
import { project } from './projects/projects.mocks';
import { translation } from './translations/translations.mocks';

export type { LanguageMock } from './languages/languages.mocks.types';
export type { ProjectMock } from './projects/projects.mocks.types';
export type { TranslationMock } from './translations/translations.mocks.types';

export const mockData = {
  values,
  factory: {
    project,
    language,
    translation,
  },
};
