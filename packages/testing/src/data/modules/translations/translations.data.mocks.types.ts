import { TMockQueryFilter } from '@/data/common/common.data.mocks.types';
import {
  ITranslationEntity,
  ITranslationFilter,
  IUTranslationFilter,
  TRequiredField,
} from '@bcm/models';

export type TMockData = ITranslationEntity;
export type TMockFilter = TMockQueryFilter<
  ITranslationFilter,
  IUTranslationFilter
>;

export type TMockPayload = {
  add: ITranslationEntity;
  edit: Partial<ITranslationEntity>;
  archive: TRequiredField<Partial<ITranslationEntity>, 'active'>;
};

export type TMockTranslation = {
  data: ITranslationEntity;
  filter: TMockFilter;
  payload: TMockPayload;
};
