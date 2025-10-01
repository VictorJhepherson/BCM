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
import { RegexLanguages } from './languages.constants';
import {
  ILanguage,
  ILanguageFilter,
  ILanguageRef,
} from './languages.interfaces';

//#region REQUESTERS
export class LanguageRefDTO implements ILanguageRef {
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  readonly _id: Types.ObjectId;
}

export class LanguageFilterDTO implements ILanguageFilter {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Transform(({ value }) => value === 'true')
  readonly active?: boolean;
}

export class LanguageFilterPGDTO extends IntersectionType(
  LanguageFilterDTO,
  PaginationDTO,
) {}
//#endregion REQUESTERS

//#region BODIES
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

export class LanguageArchiveDTO extends LanguageEditDTO {
  @IsBoolean({ message: ValidatorMessages.isBoolean })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  declare readonly active: boolean;
}
//#endregion BODIES
