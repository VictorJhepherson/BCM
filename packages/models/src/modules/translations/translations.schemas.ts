import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { LanguageEntity, ProjectEntity } from '../..';
import { ITranslation } from './translations.interfaces';
import { type TranslationTree } from './translations.types';

@Schema({ collection: 'translations', timestamps: true, versionKey: false })
export class TranslationEntity implements ITranslation {
  @Prop({ required: true })
  readonly active: boolean;

  @Prop({ type: Types.ObjectId, ref: ProjectEntity.name, required: true })
  readonly project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: LanguageEntity.name, required: true })
  readonly language: Types.ObjectId;

  @Prop({ type: Object, required: true })
  readonly translations: TranslationTree;
}

export const TranslationSchema =
  SchemaFactory.createForClass(TranslationEntity);

TranslationSchema.index({ project: 1, language: 1 }, { unique: true });
