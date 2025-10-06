import { ValidatorMessages } from '@/shared/core';

import { IPaginationQuery, TPagination, TSort, TSortOrder } from '@bcm/models';

import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDTO implements IPaginationQuery {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly sortBy?: string = 'createdAt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly sortOrder?: TSortOrder = 'DESC';

  get sort(): TSort {
    return { by: this.sortBy, order: this.sortOrder };
  }

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly page?: number = 1;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly limit?: number = 20;

  get pagination(): TPagination {
    const skip = (this.page - 1) * this.limit;

    return { skip, page: this.page, limit: this.limit };
  }
}
