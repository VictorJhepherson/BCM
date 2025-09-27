import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDTO } from '../..';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { ITranslation, ITranslationRef } from './translations.interfaces';
import { type TranslationTree } from './translations.types';

export class TranslationRefDTO implements ITranslationRef {
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly project: Types.ObjectId;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly language: Types.ObjectId;
}

export class TranslationFilterDTO extends PaginationDTO {}

export class TranslationAddDTO implements ITranslation {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly project: Types.ObjectId;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly language: Types.ObjectId;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly translations: TranslationTree;
}

export class TranslationEditDTO implements Partial<ITranslation> {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly active?: boolean;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly project?: Types.ObjectId;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly language?: Types.ObjectId;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly translations?: TranslationTree;
}
