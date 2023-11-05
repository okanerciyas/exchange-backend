import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShareEntity, TransactionEntity} from '../entities';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';

@Module({
    imports: [SequelizeModule.forFeature([TransactionEntity, ShareEntity])],
    controllers: [TransactionController],
    providers: [TransactionService],
})
export class TransactionModule {}
