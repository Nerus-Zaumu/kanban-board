import { Task } from './task.model';
import {
  Model,
  Table,
  Column,
  DataType,
  AllowNull,
  Unique,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @Unique(true)
  @AllowNull(false)
  @PrimaryKey
  @Column({ type: DataType.UUID })
  userId: string;

  @Unique(true)
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  username: string;

  @Unique(true)
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  password: string;

  @HasMany(() => Task)
  tasks: Task[];
}
