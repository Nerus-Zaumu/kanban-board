import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { TaskService } from './task.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('all')
  getAllTasks(@Request() req: any) {
    return this.taskService.getAllTasks(req.user.userId);
  }

  @Post('new')
  createNewTask(
    @Body() { title, description, completionDate },
    @Request() req: any,
  ) {
    return this.taskService.createTask(
      title,
      description,
      completionDate,
      req.user.userId,
    );
  }

  @Delete('delete')
  deleteTask(@Query('taskId') taskId: string) {
    return this.taskService.deleteTask(taskId);
  }

  @Patch('update')
  updateTask(
    @Query('taskId') taskId: string,
    @Body() { newTitle, newDescription, status },
  ) {
    return this.taskService.updateTask(
      taskId,
      newTitle,
      newDescription,
      status,
    );
  }

  @Patch('update/status')
  updateTaskStatus(@Query('taskId') taskId: string, @Body() { status }) {
    return this.taskService.updateTaskStatus(taskId, status);
  }
}
