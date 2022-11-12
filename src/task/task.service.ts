import { Status } from './../utils/status.util';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from 'src/models/task.model';
import * as uuid from 'uuid';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}
  async getAllTasks(userId: string) {
    const tasks = await this.taskModel.findAll({ where: { userId: userId } });
    if (!tasks) {
      return {
        success: false,
        error: new NotFoundException(),
      };
    }
    return {
      ...tasks,
    };
  }

  async createTask(
    title: string,
    description: string,
    completionDate: string,
    userId: string,
  ) {
    const newTask = {
      taskId: uuid.v4(),
      title: title,
      task: description,
      completionDate: new Date(completionDate),
      status: 'TODO',
      userId: userId,
    };

    const create = await this.taskModel.create(newTask);
    if (!create) {
      return {
        success: false,
        error: 'Could not create new task!',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
    return {
      success: true,
      message: 'Task created',
      payload: newTask,
    };
  }

  async deleteTask(taskId: string) {
    const taskExists = await this.taskModel.findOne({
      where: { taskId: taskId },
    });
    if (!taskExists) {
      return {
        success: false,
        message: 'Task does not exist!',
        status: HttpStatus.NOT_FOUND,
      };
    }
    const deletedTask = this.taskModel.destroy({ where: { taskId: taskId } });
    if (!deletedTask) {
      return {
        success: false,
        message: 'Could not delete task due to server error',
        status: HttpStatus.BAD_GATEWAY,
      };
    }
    return {
      success: true,
      message: 'Task deleted successfully!',
      status: HttpStatus.OK,
      task: deletedTask,
    };
  }

  async updateTask(
    taskId: string,
    newTitle?: string,
    newDescription?: string,
    status?: Status,
  ) {
    const existingTask = await this.taskModel.findOne({
      where: { taskId: taskId },
    });
    if (!existingTask) {
      return {
        success: false,
        message: 'Task to be updated does not exist!',
        status: HttpStatus.NOT_FOUND,
      };
    }
    if (!Object.values(Status).includes(status)) {
      return {
        success: false,
        message: 'Status must either be TODO, IN PROGRESS or COMPLETED',
      };
    }
    const payload = {
      title: newTitle ? newTitle : existingTask.get('title'),
      task: newDescription ? newDescription : existingTask.get('task'),
      status: status ? status : existingTask.get('status'),
    };
    const updatedTask = await this.taskModel.update(payload, {
      where: { taskId: taskId },
    });
    if (!updatedTask) {
      return {
        success: false,
        message: 'Task could not be updated due to server error',
        status: HttpStatus.BAD_GATEWAY,
      };
    }
    return {
      success: true,
      message: 'Task updated Successfully',
      payload: payload,
    };
  }

  updateTaskStatus(taskId: string, status: Status) {
    const taskExists = this.taskModel.findOne({ where: { taskId: taskId } });
    if (!taskExists) {
      return {
        success: false,
        message: 'Task does not exist',
        status: HttpStatus.NOT_FOUND,
      };
    }
    if (!Object.values(Status).includes(status)) {
      return {
        success: false,
        message: 'Status must either be TODO, IN PROGRESS or COMPLETED',
      };
    }
    const payload = { status: status };
    const updatedTask = this.taskModel.update(payload, {
      where: { taskId: taskId },
    });
    if (!updatedTask) {
      return {
        success: false,
        message: 'Task status could not be updated',
      };
    }
    return {
      success: true,
      message: 'Task status updated!',
      status: HttpStatus.OK,
    };
  }
}
