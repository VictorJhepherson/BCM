import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseStrategy } from '@shared/core';
import { format } from '@shared/helpers';
import {
  FlatProject,
  IProject,
  IProjectDeleteStrategy,
  IProjectRef,
  IQueryOptions,
  RequiredField,
} from '@shared/models';
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
    private readonly project: ProjectRepository,
    private readonly translation: TranslationRepository,
  ) {
    super('[languages]', logger);
  }

  async softDelete(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
    { session }: IQueryOptions = {},
  ): Promise<FlatProject> {
    return this.execute({
      fn: async () => {
        const updated = await this.project.updateOne(ref, payload, { session });

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

  async hardDelete(
    ref: IProjectRef,
    { session }: IQueryOptions = {},
  ): Promise<void> {
    return this.execute({
      fn: async () => {
        await this.project.deleteOne(ref, { session });
        await this.translation.deleteMany({ project: ref._id }, { session });
      },
    });
  }
}
