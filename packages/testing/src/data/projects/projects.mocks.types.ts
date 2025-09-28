import {
  IPagination,
  IProject,
  IProjectFilter,
  IProjectRef,
  Project,
  RequiredField,
} from '@shared/models';
import { DataMock } from '../common/common.mocks.types';

export type ProjectMockRef = IProjectRef;

export type ProjectMockBody = {
  add: IProject;
  edit: Partial<IProject>;
  archive: RequiredField<Partial<IProject>, 'active'>;
};

export type ProjectMockData = Partial<Project>;

export type ProjectMockFilter = IProjectFilter & IPagination;

export type ProjectMock = DataMock<
  ProjectMockRef,
  ProjectMockBody,
  ProjectMockData,
  ProjectMockFilter
>;
