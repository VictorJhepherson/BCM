import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { BaseStrategy } from '@shared/core';
import { format } from '@shared/helpers';
import {
  IProject,
  IProjectDeleteStrategy,
  IProjectRef,
  Project,
  RequiredField,
} from '@shared/models';
import { Connection } from 'mongoose';
import { LoggerProvider } from '../../../../providers';
import { TranslationRepository } from '../../../translations/repositories/translations.repository';
import { ProjectRepository } from '../../repositories/projects.repository';

@Injectable()
export class ProjectDeleteStrategy
  extends BaseStrategy
  implements IProjectDeleteStrategy
{
  constructor(
    logger: LoggerProvider,
    @InjectConnection()
    private readonly conn: Connection,
    private readonly project: ProjectRepository,
    private readonly translation: TranslationRepository,
  ) {
    super('[languages]', logger);
  }

  async softDelete(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<Project> {
    return this.withTransaction({
      connection: this.conn,
      fn: async (session) => {
        const updated = await this.project.updateOne(ref, payload, {
          session,
        });

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to archive a project for: ${format.base(ref)}`,
          });
        }

        const { matchedCount, modifiedCount } =
          await this.translation.updateMany(
            { project: ref._id },
            { active: payload.active },
            { session },
          );

        if (matchedCount > 0 && modifiedCount < 1) {
          throw new UnprocessableEntityException({
            message: `Unable to archive translations by project: ${format.base(ref)}`,
          });
        }

        return updated;
      },
    });
  }

  async hardDelete(ref: IProjectRef): Promise<void> {
    return this.withTransaction({
      connection: this.conn,
      fn: async (session) => {
        const deleted = await this.project.deleteOne(ref, { session });

        if (deleted.deletedCount < 1) {
          throw new NotFoundException({
            message: `Failed to delete a project for: ${format.base(ref)}`,
          });
        }

        const translations = await this.translation.deleteMany(
          { language: ref._id },
          { session },
        );

        if (translations.deletedCount < 1) {
          throw new UnprocessableEntityException({
            message: `Failed to delete translations by project: ${format.base(ref)}`,
          });
        }
      },
    });
  }
}
