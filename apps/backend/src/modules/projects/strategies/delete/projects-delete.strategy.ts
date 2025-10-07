import { IProjectDeleteStrategy } from '@/modules/projects/models';
import { ProjectRepository } from '@/modules/projects/repositories/projects.repository';
import { TranslationRepository } from '@/modules/translations/repositories/translations.repository';
import { BaseStrategy } from '@/shared/core';
import { format } from '@/shared/helpers';
import { IQueryOptions } from '@/shared/models';
import { LoggerProvider } from '@/shared/providers';

import {
  IProjectEntity,
  IUProjectFilter,
  TFlatProject,
  TQuery,
} from '@bcm/models';

import { Injectable, NotFoundException } from '@nestjs/common';

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
    super('[projects]', logger);
  }

  async softDelete(
    {
      filter,
      payload,
    }: TQuery<IUProjectFilter, Pick<IProjectEntity, 'active'>>,
    { session }: IQueryOptions = {},
  ): Promise<TFlatProject> {
    return this.run({
      fn: async () => {
        const updated = await this.project.updateOne(
          { filter, payload },
          { session },
        );

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to archive a project for: ${format.base(filter)}`,
          });
        }

        const { _id: project, ...filters } = filter;
        const { matchedCount, modifiedCount } =
          await this.translation.updateMany(
            { filter: { ...filters, project }, payload },
            { session },
          );

        if (matchedCount > 0 && modifiedCount < 1) {
          throw new NotFoundException({
            message: `Unable to archive translations for: ${format.base(filter)}`,
          });
        }

        return updated;
      },
    });
  }

  async hardDelete(
    { filter }: TQuery<IUProjectFilter>,
    { session }: IQueryOptions = {},
  ): Promise<void> {
    return this.run({
      fn: async () => {
        await this.project.deleteOne({ filter }, { session });

        const { _id: project, ...filters } = filter;
        await this.translation.deleteMany(
          { filter: { ...filters, project } },
          { session },
        );
      },
    });
  }
}
