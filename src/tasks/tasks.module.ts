import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskLabel } from './entities/task-label.entity';
import { AuthModule } from './../authentication/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskLabel]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
