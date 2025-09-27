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
import { LanguageRepository } from './repositories/languages.repository';
import { LanguageService } from './services/languages.service';
import { LanguageStrategy } from './strategies/languages.strategy';

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
    LanguageService,
    LanguageStrategy,
    LanguageRepository,
    TranslationRepository,
  ],
})
export class LanguageModule {}
