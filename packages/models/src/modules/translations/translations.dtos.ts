import { IsMongoId, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ValidatorMessages } from '../../errors/messages/validators.messages';
import { ITranslation } from './translations.interfaces';
import { type TranslationTree } from './translations.types';

export class AddTranslationDTO implements ITranslation {
  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  projectId: Types.ObjectId;

  @IsMongoId({ message: ValidatorMessages.isMongoId })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  languageId: Types.ObjectId;

  @IsObject({ message: ValidatorMessages.isObject })
  @IsNotEmpty({ message: ValidatorMessages.isNotEmpty })
  translations: TranslationTree;
}

export class EditTranslationDTO
  implements Partial<Omit<ITranslation, 'projectId' | 'languageId'>>
{
  @IsObject({ message: ValidatorMessages.isObject })
  @IsOptional({ message: ValidatorMessages.isOptional })
  translations?: TranslationTree;
}
