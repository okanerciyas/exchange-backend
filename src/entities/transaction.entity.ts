import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'transaction', schema: 'public' })
export class TransactionEntity extends Model<TransactionEntity> {
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
    references: {
      model: 'users',
      key: 'id',
    },
  })
  userId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'shares',
      key: 'id',
    },
  })
  shareId: string;

  @Column({
    type: DataType.ENUM,
    values: ['BUY', 'SELL'],
    allowNull: false,
  })
  type: string;

  @Column({ type: DataType.NUMBER, allowNull: false })
  amount: number;

  @Column({ type: DataType.NUMBER, allowNull: false })
  price: number;
}

export enum TransactionTypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}
