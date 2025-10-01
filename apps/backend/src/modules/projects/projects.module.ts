import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectEntity,
  ProjectSchema,
  TranslationEntity,
  TranslationSchema,
} from '@shared/models';
import { LoggerProvider } from '../../providers';
import { TranslationRepository } from '../translations/repositories/translations.repository';
import { ProjectController } from './controllers/projects.controller';
import { ProjectMapper } from './mappers/projects.mapper';
import { ProjectRepository } from './repositories/projects.repository';
import { ProjectService } from './services/projects.service';
import { ProjectDeleteStrategy } from './strategies';

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
