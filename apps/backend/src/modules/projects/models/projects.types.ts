import { IProjectEntity, TWithId, TWithLean } from '@bcm/models';
import { HydratedDocument } from 'mongoose';

export type TProject = HydratedDocument<IProjectEntity>;
export type TFlatProject = TWithLean<IProjectEntity>;

export type TMappedProject = TWithId<TFlatProject>;
