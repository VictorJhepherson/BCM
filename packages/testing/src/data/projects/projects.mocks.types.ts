import { AddProjectDTO, EditProjectDTO, Project } from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type ProjectMockRef = {
  _id: Types.ObjectId;
};

export type ProjectMockBody = {
  add: AddProjectDTO;
  edit: EditProjectDTO;
};

export type ProjectMockData = Partial<Project>;

export type ProjectMockFilter = any;

export type ProjectMock = DataMock<
  ProjectMockRef,
  ProjectMockBody,
  ProjectMockData,
  ProjectMockFilter
>;
