import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DateEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
