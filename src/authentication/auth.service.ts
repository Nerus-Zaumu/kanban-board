import { passwordMatches } from './../utils/password.utils';
import { User } from './../models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({
      where: { username: username },
    });
    if (!user) {
      return {
        success: false,
        message: 'User does not exists',
      };
    }
    if (user && passwordMatches(password, user.get('password'))) {
      return user;
    }
    return null;
  }
}
