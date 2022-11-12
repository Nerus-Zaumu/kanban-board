import { JwtService } from '@nestjs/jwt';
import { UserExistsService } from './../utils/exists.util';
import { getHashedPassword } from './../utils/password.utils';
import { User } from './../models/user.model';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private userExists: UserExistsService,
    private jwtService: JwtService,
  ) {}
  async createUser(username: string, email: string, password: string) {
    const payload = { username: username };
    const exists = await this.userExists.userExists(payload);
    if (exists) {
      return new NotFoundException('User with username already exists!');
    }
    if (password.length < 7) {
      return new Error(
        'Password is too short. Length must be at least 8 characters long but only contains ' +
          password.length +
          ' characters!',
      );
    }
    try {
      const userId = uuid.v4();
      const hashedPassword = getHashedPassword(password);
      await this.userModel.create({
        userId: userId,
        username: username,
        email: email,
        password: hashedPassword,
      });
      return {
        success: true,
        status: HttpStatus.ACCEPTED,
        message: 'User created successfully',
        payload: { username: username, email: email, password: password },
      };
    } catch (error) {
      return {
        success: false,
        status: HttpStatus.EXPECTATION_FAILED,
        message: 'Could not register user account!',
        error: error,
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.findAll();
      if (!users) {
        return {
          success: false,
          message: 'No users could be retrieved from database',
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        success: true,
        message: 'All registered users retrieved!',
        status: HttpStatus.FOUND,
        payload: users,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Could not retriev users',
        status: HttpStatus.EXPECTATION_FAILED,
        error: error,
      };
    }
  }

  async deleteUser(userId: string) {
    const payload = { userId: userId };
    const exists = this.userExists.userExists(payload);
    if (!exists) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: 'User does not exist',
      };
    }
    try {
      const user = await this.userModel.destroy({ where: { userId: userId } });
      return {
        success: true,
        message: 'User deleted successfully',
        user: user,
      };
    } catch (error) {
      return {
        success: false,
        status: HttpStatus.AMBIGUOUS,
        error: error.message,
      };
    }
  }

  async updateUser(
    userId: string,
    username?: string,
    email?: string,
    password?: string,
  ) {
    const payload = { userId: userId };
    const exists = this.userExists.userExists(payload);
    if (!exists) {
      return {
        success: false,
        message: new NotFoundException(
          'User you want to update does not exist!',
        ),
        status: HttpStatus.NOT_FOUND,
      };
    }
    try {
      const hashedPassword = password ? getHashedPassword(password) : undefined;
      const payload = {
        username: username ? username : (await exists).get('username'),
        email: email ? email : (await exists).get('email'),
        password: password ? hashedPassword : (await exists).get('password'),
      };
      await this.userModel.update(payload, { where: { userId: userId } });
      return {
        success: true,
        status: HttpStatus.CREATED,
        payload: {
          username: username ? username : (await exists).get('username'),
          email: email ? email : (await exists).get('email'),
          password: password,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'User could not be updated!',
        error: error.message,
      };
    }
  }

  async login(user: any) {
    const loggedUser = await this.userModel.findOne({
      where: { username: user.username },
    });
    if (!loggedUser) {
      return {
        success: false,
        message: 'Could not get User ',
        error: new NotFoundException(),
      };
    }
    const payload = { username: user.username, sub: loggedUser.get('userId') };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }
}
