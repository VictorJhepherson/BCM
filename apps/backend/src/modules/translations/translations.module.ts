import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TranslationEntity, TranslationSchema } from '@shared/models';
import { LoggerProvider } from '../../providers';
import { TranslationController } from './controllers/translations.controller';
import { TranslationMapper } from './mappers/translations.mapper';
import { TranslationRepository } from './repositories/translations.repository';
import { TranslationService } from './services/translations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TranslationEntity.name, schema: TranslationSchema },
    ]),
  ],
  controllers: [TranslationController],
  providers: [
    LoggerProvider,
    TranslationMapper,
    TranslationService,
    TranslationRepository,
  ],
})
export class TranslationModule {}
