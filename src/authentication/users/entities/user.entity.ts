import { Exclude } from 'class-transformer';
import { DateEntity } from 'src/entities/date.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column()
  @Exclude()
  password?: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
