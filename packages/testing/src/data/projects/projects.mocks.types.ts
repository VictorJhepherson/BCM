import { AddProjectDTO, EditProjectDTO, Project } from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type ProjectMockData = Partial<Project>;
export type ProjectMockDTO = {
  add: AddProjectDTO;
  edit: EditProjectDTO;
};

export type ProjectMockFilter = {
  _id: Types.ObjectId;
};

export type ProjectMock = DataMock<
  ProjectMockDTO,
  ProjectMockData,
  ProjectMockFilter
>;
