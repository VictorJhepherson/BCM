import { HydratedDocument } from 'mongoose';
import { WithId, WithLean } from '../..';
import { ProjectEntity } from './projects.schemas';

export type Project = HydratedDocument<ProjectEntity>;
export type FlatProject = WithLean<ProjectEntity>;

export type MappedProject = WithId<FlatProject>;
