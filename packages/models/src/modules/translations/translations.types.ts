import { TStringTree, TWithId, TWithLean } from '@/common';
import { ITranslationEntity } from '@/modules/translations/translations.interfaces';

import { HydratedDocument } from 'mongoose';

export type TTranslation = HydratedDocument<ITranslationEntity>;
export type TFlatTranslation = TWithLean<ITranslationEntity>;

export type TMappedTranslation = TWithId<TFlatTranslation>;

export type TTranslationDraft = {
  userId: string;
  translations: TStringTree;
};
