import { values } from '@/data/common/common.data.mocks';

import {
  TMockData,
  TMockFilter,
  TMockPayload,
  TMockProject,
} from './projects.data.mocks.types';

const { sort, pagination } = values;

const mockData: TMockData = {
  active: true,
  name: 'project-name',
  description: 'project-description',
  locales: ['en', 'pt', 'es', 'fr'],
  attributes: { defaultLocale: 'en' },
};

const mockFilter: TMockFilter = {
  default: { active: true, ...sort, ...pagination },
  united: {
    _id: values.database._id,
    active: true,
    sort: sort.sort,
    pagination: pagination.pagination,
  },
};

const mockPayload: TMockPayload = {
  add: {
    active: mockData.active,
    name: mockData.name,
    description: mockData.description,
    locales: mockData.locales,
    attributes: mockData.attributes,
  },
  edit: {
    description: mockData.description,
    attributes: { ...mockData.attributes, defaultLocale: 'pt' },
  },
  archive: {
    active: !mockData.active,
  },
};

export const project: TMockProject = {
  data: mockData,
  filter: mockFilter,
  payload: mockPayload,
} as const;
