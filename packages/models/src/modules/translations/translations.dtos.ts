import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDTO } from '../../common';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { RegexProjects } from '../projects/projects.constants';
import {
  ITranslation,
  ITranslationFilter,
  ITranslationRef,
} from './translations.interfaces';
import { type TranslationTree } from './translations.types';

//#region REQUESTERS
export class TranslationRefDTO implements ITranslationRef {
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly _id: Types.ObjectId;
}

export class TranslationFilterDTO implements ITranslationFilter {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Transform(({ value }) => value === 'true')
  readonly active?: boolean;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly project?: Types.ObjectId;
}

export class TranslationFilterPGDTO extends IntersectionType(
  TranslationFilterDTO,
  PaginationDTO,
) {}
//#endregion REQUESTERS

//#region BODIES
export class TranslationAddDTO implements ITranslation {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;

  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexProjects.LANGUAGE, { message: ValidatorMessages.isMatches })
  readonly language: string;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly project: Types.ObjectId;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly translations: TranslationTree;
}

export class TranslationEditDTO implements Partial<ITranslation> {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly active?: boolean;

  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexProjects.LANGUAGE, { message: ValidatorMessages.isMatches })
  readonly language?: string;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly project?: Types.ObjectId;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly translations?: TranslationTree;
}
//#endregion BODIES
