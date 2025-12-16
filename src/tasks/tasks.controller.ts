import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-tasks.dto';
import { FindOneParams } from './dtos/find-one.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './entities/task.entity';
import { CreateTaskLabelDto } from './dtos/create-task-label.dto';
import { FindTaskQueryDto } from './common/find-task.query';
import { PaginationResponse } from './../common/pagination.response';
import { PaginationQuery } from './../common/pagination.query';
import { AuthGuard } from './../authentication/auth/auth.guard';
import type { AuthRequest } from './../authentication/auth/auth.request';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(
    @Query() query: FindTaskQueryDto,
    @Query() pagination: PaginationQuery,
    @Request() request: AuthRequest,
  ): Promise<PaginationResponse<Task>> {
    const [tasks, count] = await this.tasksService.findAll(
      query,
      pagination,
      request?.user?.id,
    );
    return {
      items: tasks,
      meta: {
        total: count,
        limit: pagination.limit,
        totalPages: Math.ceil(count / 10),
        offset: pagination.offset,
      },
    };
  }

  @Get('/:id')
  public async findOne(
    @Param() params: FindOneParams,
    @Request() request: AuthRequest,
  ): Promise<Task> {
    return await this.findOneOrFail(params.id, request?.user?.id);
  }

  @Post()
  public async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() request: AuthRequest,
  ): Promise<Task> {
    return await this.tasksService.create({
      ...createTaskDto,
      userId: request.user.id,
    });
  }

  @Patch('/:id')
  public async update(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param() params: FindOneParams,
    @Request() request: AuthRequest,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id, request?.user?.id);
    try {
      return await this.tasksService.update(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException(['Cannot update task status']);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param() params: FindOneParams,
    @Request() request: AuthRequest,
  ): Promise<void> {
    await this.findOneOrFail(params.id, request?.user?.id);
    await this.tasksService.delete(params.id);
  }

  @Post('/:id/labels')
  public async addLabels(
    @Param() params: FindOneParams,
    @Body() taskLabels: CreateTaskLabelDto[],
    @Request() request: AuthRequest,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id, request?.user?.id);
    return await this.tasksService.addLabels(task, taskLabels);
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteLabels(
    @Param() params: FindOneParams,
    @Body() labelsToDelete: string[],
    @Request() request: AuthRequest,
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id, request?.user?.id);
    await this.tasksService.deleteLabels(task, labelsToDelete);
  }

  private async findOneOrFail(id: string, userId: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (task) {
      this.verifyTaskOwnership(task, userId);
      return task;
    }
    throw new NotFoundException('Task not found');
  }

  private verifyTaskOwnership(task: Task, userId: string): void {
    if (task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }
  }
}
