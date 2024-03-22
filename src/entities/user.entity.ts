import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'users', schema: 'public' })
export class UserEntity extends Model<UserEntity> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  balance: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: ['user'],
  })
  roles: string[];
}

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}
