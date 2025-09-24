import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TranslationEntity, TranslationSchema } from '@shared/models';
import { LoggerProvider } from '../../providers';
import { TranslationController } from './controllers/translations.controller';
import { TranslationRepository } from './repositories/translations.repository';
import { TranslationService } from './services/translations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TranslationEntity.name, schema: TranslationSchema },
    ]),
  ],
  providers: [LoggerProvider, TranslationRepository, TranslationService],
  controllers: [TranslationController],
})
export class TranslationModule {}
