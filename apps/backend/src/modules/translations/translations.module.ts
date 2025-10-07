import { TranslationController } from '@/modules/translations/controllers/translations.controller';
import { TranslationMapper } from '@/modules/translations/mappers/translations.mapper';
import {
  TranslationEntity,
  TranslationSchema,
} from '@/modules/translations/models';
import { TranslationRepository } from '@/modules/translations/repositories/translations.repository';
import { TranslationService } from '@/modules/translations/services/translations.service';
import { LoggerProvider } from '@/shared/providers';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
