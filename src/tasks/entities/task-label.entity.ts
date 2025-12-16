import { DateEntity } from 'src/entities/date.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  Index,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('task_labels')
@Unique(['name', 'taskId'])
export class TaskLabel extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  @Index()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  task: Task;
}
