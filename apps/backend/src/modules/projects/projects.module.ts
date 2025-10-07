import { ProjectController } from '@/modules/projects/controllers/projects.controller';
import { ProjectMapper } from '@/modules/projects/mappers/projects.mapper';
import { ProjectEntity, ProjectSchema } from '@/modules/projects/models';
import { ProjectRepository } from '@/modules/projects/repositories/projects.repository';
import { ProjectService } from '@/modules/projects/services/projects.service';
import { ProjectDeleteStrategy } from '@/modules/projects/strategies';
import {
  TranslationEntity,
  TranslationSchema,
} from '@/modules/translations/models';
import { TranslationRepository } from '@/modules/translations/repositories/translations.repository';
import { LoggerProvider } from '@/shared/providers';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectEntity.name, schema: ProjectSchema },
      { name: TranslationEntity.name, schema: TranslationSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [
    LoggerProvider,
    ProjectMapper,
    ProjectService,
    ProjectRepository,
    ProjectDeleteStrategy,
    TranslationRepository,
  ],
})
export class ProjectModule {}
