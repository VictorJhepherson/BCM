import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ValidatorMessages } from '../errors/messages/validators.messages';
import { IPagination } from './common.interfaces';
import type { Pagination, Sort, SortOrder } from './common.types';

export class PaginationDTO implements IPagination {
  @IsString({ message: ValidatorMessages.isString })
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly sortBy: string = 'createdAt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly sortOrder: SortOrder = 'DESC';

  get sort(): Sort {
    return { by: this.sortBy, order: this.sortOrder };
  }

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly page: number = 1;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional({ message: ValidatorMessages.isOptional })
  readonly limit: number = 20;

  get pagination(): Pagination {
    const skip = (this.page - 1) * this.limit;

    return { skip, page: this.page, limit: this.limit };
  }
}
