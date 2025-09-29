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
  name: values.project.name,
  active: values.project.active,
  description: values.project.description,
  createdAt: values.mongo.createdAt,
  updatedAt: values.mongo.updatedAt,
};

const filter: ProjectMockFilter = {
  ...values.filter,
};

export const project: ProjectMock = {
  ref,
  body,
  data,
  filter,
};
