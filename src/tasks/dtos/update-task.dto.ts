import { PartialType } from 'nestjs-mapped-types';
import { CreateTaskDto } from './create-tasks.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
