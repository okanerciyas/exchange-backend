import {Controller, Get, Req} from '@nestjs/common';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../entities';
import { TransactionService } from '../services/transaction.service';
import { Request } from 'express';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('all')
    @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
    async findAll(@Req() req: Request) {
        return this.transactionService.findTransactions(req.user);
    }
}
