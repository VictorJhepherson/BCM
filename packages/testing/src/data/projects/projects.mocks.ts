import { ProjectAddDTO, ProjectEditDTO } from '@shared/models';
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
  add: Object.assign(new ProjectAddDTO(), {
    name: values.project.name,
    active: values.project.active,
    description: values.project.description,
  }),
  edit: Object.assign(new ProjectEditDTO(), {
    active: false,
    description: 'project-description-edited',
  }),
};

const data: ProjectMockData = {
  _id: values.mongo._id,
  get: values.mongo.get,
  name: values.project.name,
  active: values.project.active,
  description: values.project.description,
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
