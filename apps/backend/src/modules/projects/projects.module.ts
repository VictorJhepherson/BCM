import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectEntity, ProjectSchema } from '@shared/models';
import { LoggerProvider } from '../../providers';
import { ProjectController } from './controllers/projects.controller';
import { ProjectRepository } from './repositories/projects.repository';
import { ProjectService } from './services/projects.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectEntity.name, schema: ProjectSchema },
    ]),
  ],
  providers: [LoggerProvider, ProjectRepository, ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
