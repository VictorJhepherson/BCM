import { HydratedDocument } from 'mongoose';
import { WithId, WithLean, WithPagination } from '../..';
import { ProjectEntity } from './projects.schemas';

export type Project = HydratedDocument<ProjectEntity>;
export type FlatProject = WithLean<ProjectEntity>;

export type ProjectPayload = WithId<FlatProject>;
export type MappedProject = WithPagination<ProjectPayload>;
