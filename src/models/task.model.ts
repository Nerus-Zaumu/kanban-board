import { User } from './user.model';
import {
  Model,
  Table,
  Column,
  DataType,
  AllowNull,
  Unique,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';

@Table
export class Task extends Model {
  @Unique(true)
  @AllowNull(false)
  @PrimaryKey
  @Column({ type: DataType.UUID })
  taskId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  title: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  task: string;

  @Column({ type: DataType.ENUM('TODO', 'IN PROGRESS', 'COMPLETED') })
  status: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  completionDate: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;
}
