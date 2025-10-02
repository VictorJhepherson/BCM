import { values } from '../common/common.mocks';
import {
  ProjectMock,
  ProjectMockBody,
  ProjectMockData,
  ProjectMockFilter,
  ProjectMockRef,
} from './projects.mocks.types';

const ref: ProjectMockRef = {
  _id: values.mongo._id,
};

const body: ProjectMockBody = {
  add: {
    active: values.project.active,
    name: values.project.name,
    description: values.project.description,
    languages: values.project.languages,
  },
  edit: {
    description: 'project-description-edited',
  },
  archive: {
    active: false,
  },
};

const data: ProjectMockData = {
  _id: values.mongo._id,
  active: values.project.active,
  name: values.project.name,
  description: values.project.description,
  languages: values.project.languages,
  createdAt: values.mongo.createdAt,
  updatedAt: values.mongo.updatedAt,
};

const filter: ProjectMockFilter = {
  default: {
    active: true,
  },
  pagination: {
    active: true,
    ...values.filter,
  },
  controller: {
    active: true,
    ...values.filter,
  },
};

export const project: ProjectMock = {
  ref,
  body,
  data,
  filter,
};
