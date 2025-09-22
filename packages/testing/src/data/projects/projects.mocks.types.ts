import { AddProjectDTO, EditProjectDTO, Project } from '@shared/models';
import { Types } from 'mongoose';
import { MockData } from '../common/common.mocks.types';

export type MockProjectData = Partial<Project>;
export type MockProjectDTO = {
  add: AddProjectDTO;
  edit: EditProjectDTO;
};

export type MockProjectFilter = {
  id: Types.ObjectId;
};

export type MockProject = MockData<
  MockProjectDTO,
  MockProjectData,
  MockProjectFilter
>;
