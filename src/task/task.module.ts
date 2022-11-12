import { UserModule } from './../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Task } from './../models/task.model';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtStrategy } from 'src/authentication/strategies/jwt.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '300s' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, JwtStrategy, JwtService],
  exports: [TaskService],
})
export class TaskModule {}
