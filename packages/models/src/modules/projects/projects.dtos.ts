import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDTO } from '../../common';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { RegexProjects } from './projects.constants';
import { IProject, IProjectFilter, IProjectRef } from './projects.interfaces';

//#region REQUESTERS
export class ProjectRefDTO implements IProjectRef {
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly _id: Types.ObjectId;
}

export class ProjectFilterDTO implements IProjectFilter {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Transform(({ value }) => value === 'true')
  readonly active?: boolean;
}

export class ProjectFilterPGDTO extends IntersectionType(
  ProjectFilterDTO,
  PaginationDTO,
) {}
//#endregion REQUESTERS

//#region BODIES
export class ProjectAddDTO implements IProject {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexProjects.NAME, { message: ValidatorMessages.isMatches })
  readonly name: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;

  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexProjects.DESCRIPTION, { message: ValidatorMessages.isMatches })
  readonly description: string;
}

export class ProjectEditDTO implements Partial<IProject> {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexProjects.NAME, { message: ValidatorMessages.isMatches })
  readonly name?: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly active?: boolean;

  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexProjects.DESCRIPTION, { message: ValidatorMessages.isMatches })
  readonly description?: string;
}

export class ProjectArchiveDTO extends ProjectEditDTO {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  declare readonly active: boolean;
}
//#endregion BODIES
