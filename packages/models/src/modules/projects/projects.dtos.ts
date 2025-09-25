import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDTO } from '../..';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { RegexProjects } from './projects.constants';
import { IProject, IProjectRef } from './projects.interfaces';

export class ProjectRefDTO implements IProjectRef {
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  _id: Types.ObjectId;
}

export class ProjectFilterDTO extends PaginationDTO {}

export class ProjectAddDTO implements IProject {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexProjects.NAME, { message: ValidatorMessages.isMatches })
  name: string;

  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexProjects.DESCRIPTION, { message: ValidatorMessages.isMatches })
  description: string;
}

export class ProjectEditDTO implements Partial<IProject> {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexProjects.NAME, { message: ValidatorMessages.isMatches })
  name?: string;

  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexProjects.DESCRIPTION, { message: ValidatorMessages.isMatches })
  description?: string;
}
