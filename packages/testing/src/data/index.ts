import { values } from '@/data/common/common.data.mocks';
import { project } from '@/data/modules/projects/projects.data.mocks';
import { translation } from '@/data/modules/translations/translations.data.mocks';

export { type TMockProject } from '@/data/modules/projects/projects.data.mocks.types';
export { type TMockTranslation } from '@/data/modules/translations/translations.data.mocks.types';

export const mockData = {
  project,
  translation,
  user: values.user,
  headers: values.headers,
  database: values.database,
  filter: { ...values.sort, ...values.pagination },
};
