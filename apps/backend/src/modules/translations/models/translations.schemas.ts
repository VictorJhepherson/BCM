import { ProjectEntity } from '@/modules/projects/models';
import { CommonRGX } from '@/shared/models';

import {
  ITranslationEntity,
  TStringTree,
  TTranslationDraft,
  WorkflowStatus,
} from '@bcm/models';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

/** sub-entity for draft translation */
@Schema({ timestamps: false, versionKey: false })
class TranslationDraftEntity implements TTranslationDraft {
  @Prop({ required: true })
  readonly userId: string;

  @Prop({ type: Object, required: true })
  readonly translations: TStringTree;
}
/** -------------------------------- */

@Schema({ collection: 'translations', timestamps: true, versionKey: false })
export class TranslationEntity implements ITranslationEntity {
  @Prop({ required: true, match: CommonRGX.LOCALE })
  readonly locale: string;

  @Prop({ required: true })
  readonly active: boolean;

  @Prop({
    type: String,
    enum: WorkflowStatus,
    required: true,
    default: WorkflowStatus.DRAFT,
  })
  readonly status: WorkflowStatus;

  @Prop({ required: true, ref: ProjectEntity.name })
  readonly project: Types.ObjectId;

  @Prop({ type: Object, required: true })
  readonly translations: TStringTree;

  @Prop({ type: [TranslationDraftEntity], default: [] })
  readonly drafts: TTranslationDraft[];
}

export const TranslationSchema =
  SchemaFactory.createForClass(TranslationEntity);

TranslationSchema.index({ locale: 1, project: 1 });
