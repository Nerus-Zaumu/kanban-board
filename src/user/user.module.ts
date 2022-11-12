import { AuthService } from 'src/authentication/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserExistsService } from './../utils/exists.util';
import { User } from './../models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { LocalStrategy } from 'src/authentication/strategies/local.strategy';
import { JwtStrategy } from 'src/authentication/strategies/jwt.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserExistsService,
    LocalStrategy,
    AuthService,
    JwtService,
    JwtStrategy,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {}
