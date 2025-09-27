import {
  IPagination,
  IProject,
  IProjectFilter,
  IProjectRef,
  Project,
} from '@shared/models';
import { DataMock } from '../common/common.mocks.types';

export type ProjectMockRef = IProjectRef;

export type ProjectMockBody = {
  add: IProject;
  edit: Partial<IProject>;
};

export type ProjectMockData = Partial<Project>;

export type ProjectMockFilter = IProjectFilter & IPagination;

export type ProjectMock = DataMock<
  ProjectMockRef,
  ProjectMockBody,
  ProjectMockData,
  ProjectMockFilter
>;
