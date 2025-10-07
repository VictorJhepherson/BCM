import { ValidatorMessages } from '@/shared/core';
import { CommonRGX, PaginationDTO } from '@/shared/models';

import {
  ITranslationEntity,
  ITranslationFilter,
  IUTranslationFilter,
  TStringTree,
  TTranslationDraft,
  WorkflowStatus,
} from '@bcm/models';

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

/** sub-DTO for draft translation */
class TranslationDraftAddDTO implements TTranslationDraft {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  userId: string;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  translations: TStringTree = {};
}
/** ----------------------------- */

export class TranslationFilterDTO
  extends PaginationDTO
  implements ITranslationFilter
{
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(CommonRGX.LOCALE, { message: ValidatorMessages.isMatches })
  readonly locale?: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Transform(({ value }) => value === 'true')
  readonly active?: boolean;

  @IsEnum(WorkflowStatus, { message: ValidatorMessages.isEnum })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly status?: WorkflowStatus;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly project?: Types.ObjectId;
}

export class UTranslationFilterDTO
  extends TranslationFilterDTO
  implements IUTranslationFilter
{
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly _id: Types.ObjectId;
}

export class TranslationAddDTO implements ITranslationEntity {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(CommonRGX.LOCALE, { message: ValidatorMessages.isMatches })
  readonly locale: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;

  @IsEnum(WorkflowStatus, { message: ValidatorMessages.isEnum })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly status: WorkflowStatus = WorkflowStatus.DRAFT;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly project: Types.ObjectId;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly translations: TStringTree = {};

  @IsArray({ message: ValidatorMessages.isArray })
  @ValidateNested({ each: true })
  @Type(() => TranslationDraftAddDTO)
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly drafts: TTranslationDraft[] = [];
}

export class TranslationEditDTO implements Partial<ITranslationEntity> {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(CommonRGX.LOCALE, { message: ValidatorMessages.isMatches })
  readonly locale?: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly active?: boolean;

  @IsEnum(WorkflowStatus, { message: ValidatorMessages.isEnum })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly status?: WorkflowStatus;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly project?: Types.ObjectId;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly translations?: TStringTree;

  @IsArray({ message: ValidatorMessages.isArray })
  @ValidateNested({ each: true })
  @Type(() => TranslationDraftAddDTO)
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly drafts?: TTranslationDraft[];
}

export class TranslationArchiveDTO
  implements Pick<ITranslationEntity, 'active'>
{
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;
}
