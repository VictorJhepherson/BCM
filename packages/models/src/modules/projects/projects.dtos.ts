import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { RegexProjects } from './projects.constants';
import { IProject } from './projects.interfaces';

export class AddProjectDTO implements IProject {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexProjects.NAME, { message: ValidatorMessages.isMatches })
  name: string;

  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexProjects.DESCRIPTION, { message: ValidatorMessages.isMatches })
  description: string;
}

export class EditProjectDTO implements Partial<IProject> {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexProjects.NAME, { message: ValidatorMessages.isMatches })
  name?: string;

  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexProjects.DESCRIPTION, { message: ValidatorMessages.isMatches })
  description?: string;
}
