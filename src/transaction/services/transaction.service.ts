import { Injectable } from '@nestjs/common';
import { ShareEntity, TransactionEntity} from '../../entities';
import { InjectModel } from '@nestjs/sequelize';
import {TransactionResponseDto} from '../dto/transaction.dto';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(TransactionEntity)
        private readonly transactionModel: typeof TransactionEntity,

        @InjectModel(ShareEntity)
        private readonly shareModel: typeof ShareEntity,
    ) {}

    async findTransactions(currentUser: any) {
        const transaction = await this.transactionModel.findAll({ where: { userId: currentUser.sub } });

        return await Promise.all(transaction.map(async (item) => {
            const share = await this.shareModel.findOne({ where: { id: item.shareId } });
            const responseDto = new TransactionResponseDto();
            responseDto.type = item.type;
            responseDto.shareName = share.name;
            responseDto.shareSymbol = share.symbol;
            responseDto.amount = item.amount;
            responseDto.price = item.price;
            responseDto.createdAt = item.createdAt;
            return responseDto;
        }));
    }
}
