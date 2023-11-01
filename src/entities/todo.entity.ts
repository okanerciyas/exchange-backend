import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'todo', schema: 'public' })
export class Todo extends Model<Todo> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  })
  teamId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  })
  userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  summary?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'needsAction',
  })
  status: TodoStatusEnum;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isPrivate: boolean;
}

export enum TodoStatusEnum {
  NEEDS_ACTION = 'needsAction',
  COMPLETED = 'completed',
}
