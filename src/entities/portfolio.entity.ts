import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'portfolio', schema: 'public' })
export class PortfolioEntity extends Model<PortfolioEntity> {
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
      model: 'users',
      key: 'id',
    },
  })
  userId: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
    allowNull: false,
  })
  shares: string[];
}
