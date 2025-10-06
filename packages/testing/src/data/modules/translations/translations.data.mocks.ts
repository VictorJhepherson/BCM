import { values } from '@/data/common/common.data.mocks';

import { WorkflowStatus } from '@bcm/models';
import {
  TMockData,
  TMockFilter,
  TMockPayload,
  TMockTranslation,
} from './translations.data.mocks.types';

const mockData: TMockData = {
  locale: 'en',
  active: true,
  status: WorkflowStatus.PUBLISHED,
  project: values.database._id,
  translations: { welcome: 'Hello World!' },
  drafts: [],
};

const mockFilter: TMockFilter = {
  united: { _id: values.database._id, active: true },
  default: { active: true, ...values.sort, ...values.pagination },
};

const mockPayload: TMockPayload = {
  add: {
    locale: mockData.locale,
    active: mockData.active,
    status: mockData.status,
    project: mockData.project,
    translations: mockData.translations,
    drafts: mockData.drafts,
  },
  edit: {
    status: WorkflowStatus.DRAFT,
    translations: mockData.translations,
    drafts: [
      { userId: 'user-id', translations: { welcome: 'Hello Padawan!!' } },
    ],
  },
  archive: {
    active: !mockData.active,
  },
};

export const translation: TMockTranslation = {
  data: mockData,
  filter: mockFilter,
  payload: mockPayload,
} as const;
