import { HydratedDocument } from 'mongoose';
import { MongoPayload, WithPagination } from '../..';
import { IProject } from './projects.interfaces';
import { ProjectEntity } from './projects.schemas';

export type Project = HydratedDocument<ProjectEntity>;

export type ProjectPayload = IProject & MongoPayload;

export type MappedProject = WithPagination<ProjectPayload>;
