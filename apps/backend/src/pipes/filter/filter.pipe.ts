import { Injectable, PipeTransform } from '@nestjs/common';
import { PaginationDTO } from '@shared/models';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FilterPipe implements PipeTransform {
  transform(value: any) {
    const filter = plainToInstance(PaginationDTO, value);
    const exclusions = ['page', 'limit', 'sortBy', 'sortOrder'];

    for (const key of exclusions) {
      if (key in value) delete value[key];
    }

    return { ...value, sort: filter.sort, pagination: filter.pagination };
  }
}
