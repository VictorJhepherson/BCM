import {
  Project,
  ProjectAddDTO,
  ProjectEditDTO,
  ProjectFilterDTO,
} from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type ProjectMockRef = {
  _id: Types.ObjectId;
};

export type ProjectMockBody = {
  add: ProjectAddDTO;
  edit: ProjectEditDTO;
};

export type ProjectMockData = Partial<Project>;

export type ProjectMockFilter = ProjectFilterDTO;

export type ProjectMock = DataMock<
  ProjectMockRef,
  ProjectMockBody,
  ProjectMockData,
  ProjectMockFilter
>;
