import { values } from '@/data/common/common.data.mocks';
import { project } from '@/data/modules/projects/projects.data.mocks';
import { translation } from '@/data/modules/translations/translations.data.mocks';

export const mockData = {
  project,
  translation,
  database: values.database,
  filter: { ...values.sort, ...values.pagination },
};
