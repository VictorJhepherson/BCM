import { AddProjectDTO, EditProjectDTO } from '@shared/models';
import { values } from '../common/common.mocks';
import {
  MockProject,
  MockProjectData,
  MockProjectDTO,
  MockProjectFilter,
} from './projects.mocks.types';

const dto: MockProjectDTO = {
  add: Object.assign(new AddProjectDTO(), {
    name: values.project.name,
    description: values.project.description,
  }),
  edit: Object.assign(new EditProjectDTO(), {
    description: 'project-description-edited',
  }),
};

const data: MockProjectData = {
  name: values.project.name,
  description: values.project.description,
};

const filter: MockProjectFilter = {
  id: values.mongo._id,
};

export const project: MockProject = {
  dto,
  data,
  filter,
};
