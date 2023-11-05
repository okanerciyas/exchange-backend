import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  PortfolioEntity,
  PortfolioSharesEntity,
  ShareEntity,
  TransactionEntity,
  UserEntity,
} from '../entities';
import { PortfolioController } from './controllers/portfolio.controller';
import { PortfolioService } from './services/portfolio.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PortfolioEntity,
      PortfolioSharesEntity,
      ShareEntity,
      UserEntity,
      TransactionEntity,
    ]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
