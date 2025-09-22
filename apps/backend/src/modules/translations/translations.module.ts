import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TranslationEntity, TranslationSchema } from '@shared/models';
import { TranslationController } from './controllers/translations.controller';
import { TranslationRepository } from './repositories/translations.repository';
import { TranslationService } from './services/translations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TranslationEntity.name, schema: TranslationSchema },
    ]),
  ],
  providers: [TranslationRepository, TranslationService],
  controllers: [TranslationController],
})
export class TranslationModule {}
