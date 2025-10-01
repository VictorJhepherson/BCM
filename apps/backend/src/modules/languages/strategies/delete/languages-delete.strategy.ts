import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseStrategy } from '@shared/core';
import { format } from '@shared/helpers';
import {
  FlatLanguage,
  ILanguage,
  ILanguageDeleteStrategy,
  ILanguageRef,
  IQueryOptions,
  RequiredField,
} from '@shared/models';
import { LoggerProvider } from '../../../../providers';
import { TranslationRepository } from '../../../translations/repositories/translations.repository';
import { LanguageRepository } from '../../repositories/languages.repository';

@Injectable()
export class LanguageDeleteStrategy
  extends BaseStrategy
  implements ILanguageDeleteStrategy
{
  constructor(
    logger: LoggerProvider,
    private readonly language: LanguageRepository,
    private readonly translation: TranslationRepository,
  ) {
    super('[languages]', logger);
  }

  async softDelete(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
    { session }: IQueryOptions = {},
  ): Promise<FlatLanguage> {
    return this.execute({
      fn: async () => {
        const updated = await this.language.updateOne(ref, payload, {
          session,
        });

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to archive a language for: ${format.base(ref)}`,
          });
        }

        const { matchedCount, modifiedCount } =
          await this.translation.updateMany(
            { language: ref._id },
            { active: payload.active },
            { session },
          );

        if (matchedCount > 0 && modifiedCount < 1) {
          throw new UnprocessableEntityException({
            message: `Unable to archive translations by language: ${format.base(ref)}`,
          });
        }

        return updated;
      },
    });
  }

  async hardDelete(
    ref: ILanguageRef,
    { session }: IQueryOptions = {},
  ): Promise<void> {
    return this.execute({
      fn: async () => {
        await this.language.deleteOne(ref, { session });
        await this.translation.deleteMany({ language: ref._id }, { session });
      },
    });
  }
}
