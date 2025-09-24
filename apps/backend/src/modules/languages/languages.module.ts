import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageEntity, LanguageSchema } from '@shared/models';
import { LoggerProvider } from '../../providers';
import { LanguageController } from './controllers/languages.controller';
import { LanguageRepository } from './repositories/languages.repository';
import { LanguageService } from './services/languages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LanguageEntity.name, schema: LanguageSchema },
    ]),
  ],
  providers: [LoggerProvider, LanguageRepository, LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
