import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'portfolio_shares', schema: 'public' })
export class PortfolioSharesEntity extends Model<PortfolioSharesEntity> {
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
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    references: {
      model: 'portfolio',
      key: 'id',
    },
  })
  portfolioId: string;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    references: {
      model: 'share',
      key: 'id',
    },
  })
  shareId: string;

  @Column({ type: DataType.NUMBER, allowNull: false })
  amount: number;
}
