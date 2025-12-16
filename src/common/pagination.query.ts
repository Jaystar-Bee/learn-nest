import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(10000)
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset: number = 0;
}
