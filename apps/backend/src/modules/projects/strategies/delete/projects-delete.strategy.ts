import {
  IProjectDeleteStrategy,
  TFlatProject,
} from '@/modules/projects/models';
import { ProjectRepository } from '@/modules/projects/repositories/projects.repository';
import { BaseStrategy } from '@/shared/core';
import { format } from '@/shared/helpers';
import { IQueryOptions } from '@/shared/models';
import { LoggerProvider } from '@/shared/providers';

import { IProjectEntity, IUProjectFilter, TQuery } from '@bcm/models';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProjectDeleteStrategy
  extends BaseStrategy
  implements IProjectDeleteStrategy
{
  constructor(
    logger: LoggerProvider,
    private readonly project: ProjectRepository,
  ) {
    super('[languages]', logger);
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

        /** TODO: Add translations repository */

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
        /** TODO: Add translations repository */
      },
    });
  }
}
