import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { RegexLanguages } from './languages.constants';
import { ILanguage } from './languages.interfaces';

export class AddLanguageDTO implements ILanguage {
  @IsString({ message: ValidatorMessages.isString })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  @Matches(RegexLanguages.LANGUAGE, { message: ValidatorMessages.isMatches })
  language: string;
}

export class EditLanguageDTO implements Partial<ILanguage> {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  @Matches(RegexLanguages.LANGUAGE, { message: ValidatorMessages.isMatches })
  language?: string;
}
