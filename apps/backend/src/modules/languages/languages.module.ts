import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LanguageEntity,
  LanguageSchema,
  TranslationEntity,
  TranslationSchema,
} from '@shared/models';
import { LoggerProvider } from '../../providers';
import { TranslationRepository } from '../translations/repositories/translations.repository';
import { LanguageController } from './controllers/languages.controller';
import { LanguageMapper } from './mappers/languages.mapper';
import { LanguageRepository } from './repositories/languages.repository';
import { LanguageService } from './services/languages.service';
import { LanguageDeleteStrategy } from './strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LanguageEntity.name, schema: LanguageSchema },
      { name: TranslationEntity.name, schema: TranslationSchema },
    ]),
  ],
  controllers: [LanguageController],
  providers: [
    LoggerProvider,
    LanguageMapper,
    LanguageService,
    LanguageRepository,
    LanguageDeleteStrategy,
    TranslationRepository,
  ],
})
export class LanguageModule {}
