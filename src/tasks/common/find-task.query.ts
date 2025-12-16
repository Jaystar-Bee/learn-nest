import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../tasks.model';
import { Transform } from 'class-transformer';

export class FindTaskQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        ?.map((item) => item.trim())
        ?.filter((item) => item);
    }
    return undefined;
  })
  labels: string[];

  @IsOptional()
  @IsIn(['title', 'description', 'createdAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
