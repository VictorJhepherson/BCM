import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RegexLanguages } from './languages.constants';
import { ILanguage } from './languages.interfaces';

@Schema({ collection: 'languages', timestamps: true, versionKey: false })
export class LanguageEntity implements ILanguage {
  @Prop({ unique: true, required: true, match: RegexLanguages.LANGUAGE })
  name: string;

  @Prop({ required: true })
  active: boolean;
}

export const LanguageSchema = SchemaFactory.createForClass(LanguageEntity);
