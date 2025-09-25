import { HydratedDocument, Types } from 'mongoose';
import { WithPagination } from '../..';
import { IProject } from './projects.interfaces';
import { ProjectEntity } from './projects.schemas';

export type Project = HydratedDocument<ProjectEntity>;

type ProjectPayload = IProject & {
  id: Types.ObjectId;
};

export type MappedProject = WithPagination<ProjectPayload>;
