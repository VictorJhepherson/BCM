import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDTO } from '../..';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { RegexLanguages } from './languages.constants';
import { ILanguage, ILanguageRef } from './languages.interfaces';

export class LanguageRefDTO implements ILanguageRef {
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly _id: Types.ObjectId;
}

export class LanguageFilterDTO extends PaginationDTO {}

export class LanguageAddDTO implements ILanguage {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexLanguages.LANGUAGE, { message: ValidatorMessages.isMatches })
  readonly name: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly active: boolean;
}

export class LanguageEditDTO implements Partial<ILanguage> {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexLanguages.LANGUAGE, { message: ValidatorMessages.isMatches })
  readonly name?: string;

  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly active?: boolean;
}
