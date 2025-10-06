import { AppModule } from '@/app.module';
import { AppErrorFilter } from '@/shared/filters';
import { PermissionGuard } from '@/shared/guards';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalFilters(new AppErrorFilter());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalGuards(app.get(PermissionGuard));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
