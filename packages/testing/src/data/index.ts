import { values } from './common/common.mocks';
import { language } from './languages/languages.mocks';
import { project } from './projects/projects.mocks';
import { translation } from './translations/translations.mocks';

export type { MockLanguage } from './languages/languages.mocks.types';
export type { MockProject } from './projects/projects.mocks.types';
export type { MockTranslation } from './translations/translations.mocks.types';

export const mockData = {
  values,
  factory: {
    project,
    language,
    translation,
  },
};
