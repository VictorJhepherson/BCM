import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageEntity, LanguageSchema } from '@shared/models';
import { LanguageController } from './controllers/languages.controller';
import { LanguageRepository } from './repositories/languages.repository';
import { LanguageService } from './services/languages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LanguageEntity.name, schema: LanguageSchema },
    ]),
  ],
  providers: [LanguageRepository, LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
