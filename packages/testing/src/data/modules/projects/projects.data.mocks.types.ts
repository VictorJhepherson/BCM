import { TMockQueryFilter } from '@/data/common/common.data.mocks.types';
import {
  IProjectEntity,
  IProjectFilterPG,
  IUProjectFilterPG,
  TRequiredField,
} from '@bcm/models';

export type TMockData = IProjectEntity;
export type TMockFilter = TMockQueryFilter<IProjectFilterPG, IUProjectFilterPG>;

export type TMockPayload = {
  add: IProjectEntity;
  edit: Partial<IProjectEntity>;
  archive: TRequiredField<Partial<IProjectEntity>, 'active'>;
};

export type TMockProject = {
  data: IProjectEntity;
  filter: TMockFilter;
  payload: TMockPayload;
};
