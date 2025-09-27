import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { BaseStrategy } from '@shared/core';
import { format } from '@shared/helpers';
import {
  ILanguage,
  ILanguageRef,
  ILanguageStrategy,
  Language,
  RequiredField,
} from '@shared/models';
import { Connection } from 'mongoose';
import { LoggerProvider } from '../../../providers';
import { TranslationRepository } from '../../translations/repositories/translations.repository';
import { LanguageRepository } from '../repositories/languages.repository';

@Injectable()
export class LanguageStrategy
  extends BaseStrategy
  implements ILanguageStrategy
{
  constructor(
    logger: LoggerProvider,
    @InjectConnection()
    private readonly conn: Connection,
    private readonly language: LanguageRepository,
    private readonly translation: TranslationRepository,
  ) {
    super('[languages]', logger);
  }

  async softDelete(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<Language> {
    return this.withTransaction({
      connection: this.conn,
      fn: async (session) => {
        const updated = await this.language.updateOne(ref, payload, {
          session,
        });

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to find a language for: ${format.base(ref)}`,
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

  async hardDelete(ref: ILanguageRef): Promise<void> {
    return this.withTransaction({
      connection: this.conn,
      fn: async (session) => {
        const deleted = await this.language.deleteOne(ref, { session });

        if (deleted.deletedCount < 1) {
          throw new NotFoundException({
            message: `Failed to delete a language for: ${format.base(ref)}`,
          });
        }

        const translations = await this.translation.deleteMany(
          { language: ref._id },
          { session },
        );

        if (translations.deletedCount < 1) {
          throw new UnprocessableEntityException({
            message: `Failed to delete translations by language: ${format.base(ref)}`,
          });
        }
      },
    });
  }
}
