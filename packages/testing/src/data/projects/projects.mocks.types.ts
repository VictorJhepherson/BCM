import {
  FlatProject,
  IProject,
  IProjectFilter,
  IProjectFilterPG,
  IProjectRef,
  RequiredField,
} from '@shared/models';
import {
  DataMock,
  MockPagination,
  MockSort,
} from '../common/common.mocks.types';

export type ProjectMockRef = IProjectRef;

export type ProjectMockBody = {
  add: IProject;
  edit: Partial<IProject>;
  archive: RequiredField<Partial<IProject>, 'active'>;
};

export type ProjectMockData = Partial<FlatProject>;

export type ProjectMockFilter = {
  default: IProjectFilter;
  pagination: IProjectFilterPG;
  controller: IProjectFilter & MockSort & MockPagination;
};

export type ProjectMock = DataMock<
  ProjectMockRef,
  ProjectMockBody,
  ProjectMockData,
  ProjectMockFilter
>;
