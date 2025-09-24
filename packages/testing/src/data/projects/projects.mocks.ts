import { AddProjectDTO, EditProjectDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  ProjectMock,
  ProjectMockData,
  ProjectMockDTO,
  ProjectMockFilter,
} from './projects.mocks.types';

const dto: ProjectMockDTO = {
  add: Object.assign(new AddProjectDTO(), {
    name: values.project.name,
    description: values.project.description,
  }),
  edit: Object.assign(new EditProjectDTO(), {
    description: 'project-description-edited',
  }),
};

const data: ProjectMockData = {
  name: values.project.name,
  description: values.project.description,
};

const filter: ProjectMockFilter = {
  _id: values.mongo._id,
};

export const project: ProjectMock = {
  dto,
  data,
  filter,
};
