import { ProjectRGX } from '@/modules/projects/models/projects.constants';
import { ValidatorMessages } from '@/shared/core';
import { PaginationDTO } from '@/shared/models';

import { IProjectEntity, IProjectFilter, IUProjectFilter } from '@bcm/models';

import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';

export class ProjectFilterDTO extends PaginationDTO implements IProjectFilter {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Transform(({ value }) => value === 'true')
  readonly active?: boolean;
}

export class UProjectFilterDTO
  extends ProjectFilterDTO
  implements IUProjectFilter
{
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly _id: Types.ObjectId;
}

export class ProjectAddDTO implements IProjectEntity {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(ProjectRGX.NAME, { message: ValidatorMessages.isMatches })
  readonly name: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;

  @IsArray({ message: ValidatorMessages.isArray })
  @IsString({ each: true, message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(ProjectRGX.LOCALE, {
    each: true,
    message: ValidatorMessages.isMatches,
  })
  readonly locales: string[];

  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(ProjectRGX.DESCRIPTION, { message: ValidatorMessages.isMatches })
  readonly description: string;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly attributes: Record<string, string | number | boolean | string[]> =
    {};
}

export class ProjectEditDTO implements Partial<IProjectEntity> {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(ProjectRGX.NAME, { message: ValidatorMessages.isMatches })
  readonly name?: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly active?: boolean;

  @IsArray({ message: ValidatorMessages.isArray })
  @IsString({ each: true, message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(ProjectRGX.LOCALE, {
    each: true,
    message: ValidatorMessages.isMatches,
  })
  readonly locales?: string[];

  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(ProjectRGX.DESCRIPTION, { message: ValidatorMessages.isMatches })
  readonly description?: string;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly attributes?: Record<string, string | number | boolean | string[]>;
}

export class ProjectArchiveDTO implements Pick<IProjectEntity, 'active'> {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;
}
