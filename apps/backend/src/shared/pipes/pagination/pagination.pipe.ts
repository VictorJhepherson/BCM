import { PaginationDTO } from '@/shared/models';
import { Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any) {
    const original = { ...value };

    const filter = plainToInstance(PaginationDTO, value);
    const exclusions = ['page', 'limit', 'sortBy', 'sortOrder'];

    for (const key of exclusions) {
      if (key in original) delete original[key];
    }

    return { ...original, sort: filter.sort, pagination: filter.pagination };
  }
}
