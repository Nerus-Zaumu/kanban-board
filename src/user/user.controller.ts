import { LocalAuthGuard } from '../gaurds/local-auth.gaurd';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  register(@Body() { username, email, password }) {
    return this.userService.createUser(username, email, password);
  }

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete('delete')
  deleteUser(@Query('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Patch('update')
  updateUser(
    @Query('userId') userId: string,
    @Body() { username, email, password },
  ) {
    return this.userService.updateUser(userId, username, email, password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginUser(@Request() req: any) {
    return this.userService.login(req.body);
  }
}
