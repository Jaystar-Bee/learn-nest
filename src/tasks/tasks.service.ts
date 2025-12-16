import { Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dtos/create-tasks.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './dtos/create-task-label.dto';
import { TaskLabel } from './entities/task-label.entity';
import { FindTaskQueryDto } from './common/find-task.query';
import { PaginationQuery } from 'src/common/pagination.query';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskLabel)
    private readonly taskLabelRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(
    filters: FindTaskQueryDto,
    pagination: PaginationQuery,
    userId: string,
  ): Promise<[Task[], number]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels')
      .where('task.userId = :userId', { userId });

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }
    if (filters.search?.trim()) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.labels?.length) {
      const subQuery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_labels', 'labels')
        .where('labels.name IN (:...labels)', {
          labels: filters.labels,
        })
        .getQuery();

      query.andWhere(`task.id IN ${subQuery}`);
      // query.andWhere('labels.name IN (:...labels)', {
      //   labels: filters.labels,
      // });
    }

    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

    return await query
      .skip(pagination.offset * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async create(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels && createTaskDto.labels.length) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }

  public async update(task: Task, updateTask: UpdateTaskDto): Promise<Task> {
    if (
      updateTask.status &&
      !this.isValidStatusTransition(task.status, updateTask.status)
    ) {
      throw new WrongTaskStatusException();
    }

    if (updateTask.labels && updateTask.labels?.length) {
      const newLabels = new Set(
        this.getUniqueLabels(updateTask?.labels)?.map((label) => label?.name),
      );
      const existingLabels = new Set(task.labels.map((label) => label.name));

      const labels = Array.from(newLabels).filter(
        (label) => !existingLabels.has(label),
      );
      if (labels && labels?.length) {
        updateTask.labels = labels.map((label) =>
          this.taskLabelRepository.create({ name: label }),
        );
      } else {
        updateTask.labels = undefined;
      }
    }
    Object.assign(task, updateTask);
    return await this.taskRepository.save(task);
  }
  public async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  public async deleteLabels(
    task: Task,
    labelsToDelete: string[],
  ): Promise<void> {
    task.labels = task.labels.filter(
      (label) => !labelsToDelete.includes(label?.id),
    );
    await this.taskRepository.save(task);
  }

  public async addLabels(
    task: Task,
    taskLabels: CreateTaskLabelDto[],
  ): Promise<Task> {
    const newLabels = new Set(
      this.getUniqueLabels(taskLabels)?.map((label) => label?.name),
    );
    const existingLabels = new Set(task.labels.map((label) => label.name));

    const labelsToAdd = Array.from(newLabels).filter(
      (label) => !existingLabels.has(label),
    );

    task.labels = task.labels.concat(
      labelsToAdd.map((label) => {
        return this.taskLabelRepository.create({ name: label });
      }),
    );
    return await this.taskRepository.save(task);
  }

  private getUniqueLabels(labels: CreateTaskLabelDto[]): CreateTaskLabelDto[] {
    const uniqueLabels = Array.from(new Set(labels.map((label) => label.name)));
    return uniqueLabels.map((name) => {
      return { name };
    });
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ) {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) < statusOrder.indexOf(newStatus);
  }
}
