import {
  FlatProject,
  IPagination,
  IProject,
  IProjectFilter,
  IProjectRef,
  RequiredField,
} from '@shared/models';
import { DataMock } from '../common/common.mocks.types';

export type ProjectMockRef = IProjectRef;

export type ProjectMockBody = {
  add: IProject;
  edit: Partial<IProject>;
  archive: RequiredField<Partial<IProject>, 'active'>;
};

export type ProjectMockData = Partial<FlatProject>;

export type ProjectMockFilter = IProjectFilter & IPagination;

export type ProjectMock = DataMock<
  ProjectMockRef,
  ProjectMockBody,
  ProjectMockData,
  ProjectMockFilter
>;
