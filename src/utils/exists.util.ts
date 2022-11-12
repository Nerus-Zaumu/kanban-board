import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './../models/user.model';

@Injectable()
export class UserExistsService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  userExists = async (payload: {
    userId?: string;
    username?: string;
    email?: string;
  }) => {
    const query: { userId?: string; username?: string; email?: string } = {};
    if (payload.userId) {
      query.userId = payload.userId;
    }
    if (payload.username) {
      query.username = payload.username;
    }
    if (payload.email) {
      query.email = payload.email;
    }
    const exists = await this.userModel.findOne({ where: query });
    return exists;
  };
}
