import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  PortfolioEntity,
  PortfolioSharesEntity,
  ShareEntity,
  TransactionEntity,
  TransactionTypeEnum,
  UserEntity,
} from '../../entities';
import { InjectModel } from '@nestjs/sequelize';
import { PortfolioDto } from '../dto/portfolio.dto';
import { AddInPortfolioDto } from '../dto/add-in-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(PortfolioEntity)
    private readonly portfolioModel: typeof PortfolioEntity,

    @InjectModel(PortfolioSharesEntity)
    private readonly portfolioSharesModel: typeof PortfolioSharesEntity,

    @InjectModel(ShareEntity)
    private readonly shareModel: typeof ShareEntity,

    @InjectModel(UserEntity)
    private readonly userModel: typeof UserEntity,

    @InjectModel(TransactionEntity)
    private readonly transactionModel: typeof TransactionEntity,
  ) {}

  async createPortfolio(user: any) {
    return await this.portfolioModel.create({
      userId: user.sub,
    });
  }

  async addShareInPortfolio(addInPortfolio: AddInPortfolioDto, currUser: any) {
    const { shareId } = addInPortfolio;

    const portfolio = await this.portfolioModel.findOne({
      where: { userId: currUser.sub },
    });

    if (!portfolio) {
      throw new ForbiddenException('Portfolio not found');
    }

    const share = await this.shareModel.findOne({
      where: { id: shareId },
    });

    if (!share) {
      throw new ForbiddenException('Share not found');
    }

    const existPortfolioShare = await this.portfolioSharesModel.findOne({
      where: { portfolioId: portfolio.id, shareId },
    });

    if (existPortfolioShare) {
      throw new ForbiddenException('Share already in portfolio');
    }

    return await this.portfolioSharesModel.create({
      portfolioId: portfolio.id,
      shareId,
      amount: 0,
    });
  }

  async buyShare(addInPortfolio: PortfolioDto, currUser: any) {
    const { shareId, amount } = addInPortfolio;
    const { portfolio, share, user, existPortfolioShare } = await this.check(
      shareId,
      currUser.sub,
    );

    if (share.amount < amount) {
      throw new ForbiddenException('Not enough share');
    }

    if (user.balance < amount * share.price) {
      throw new ForbiddenException('Not enough money');
    }

    await user.update({
      balance: user.balance - amount * share.price,
    });

    await share.update({
      amount: share.amount - amount,
    });

    await this.transactionModel.create({
      userId: currUser.sub,
      shareId,
      amount,
      price: share.price,
      type: TransactionTypeEnum.BUY,
    });

    if (existPortfolioShare) {
      return await existPortfolioShare.update({
        amount: existPortfolioShare.amount + amount,
      });
    }

    return await this.portfolioSharesModel.create({
      portfolioId: portfolio.id,
      shareId,
      amount,
    });
  }

  async check(shareId: string, userId: string) {
    const portfolio = await this.portfolioModel.findOne({
      where: { userId: userId },
    });

    if (!portfolio) {
      throw new ForbiddenException('Portfolio not found');
    }

    const share = await this.shareModel.findOne({
      where: { id: shareId },
    });

    if (!share) {
      throw new ForbiddenException('Share not found');
    }

    const shareInPortfolio = await this.portfolioSharesModel.findOne({
      where: { portfolioId: portfolio.id, shareId },
    });

    if (!shareInPortfolio) {
      throw new ForbiddenException('Share not found in portfolio');
    }

    const user = await this.userModel.findOne({
      where: { id: userId },
    });

    const existPortfolioShare = await this.portfolioSharesModel.findOne({
      where: { portfolioId: portfolio.id, shareId },
    });

    if (!existPortfolioShare) {
      throw new ForbiddenException('Share not found in portfolio');
    }
    return { portfolio, share, user, existPortfolioShare };
  }

  async sellShare(addInPortfolio: PortfolioDto, currUser: any) {
    const { shareId, amount } = addInPortfolio;

    const { share, user, existPortfolioShare } = await this.check(
      shareId,
      currUser.sub,
    );

    if (existPortfolioShare.amount < amount) {
      throw new ForbiddenException('Not enough share');
    }

    const calculatedBalance = parseFloat(
      Number(Number(user.balance) + Number(amount * share.price)).toFixed(2),
    );

    await user.update({
      balance: calculatedBalance,
    });

    await share.update({
      amount: share.amount + amount,
    });

    await this.transactionModel.create({
      userId: currUser.sub,
      shareId,
      amount,
      price: share.price,
      type: TransactionTypeEnum.SELL,
    });

    return await existPortfolioShare.update({
      amount: existPortfolioShare.amount - amount,
    });
  }

  async getAllPortfolio(currUser: any) {
    const portfolio = await this.portfolioModel.findOne({
      where: { userId: currUser.sub },
    });

    if (!portfolio) {
      throw new ForbiddenException('Portfolio not found');
    }

    const portfolioShares = await this.portfolioSharesModel.findAll({
      where: { portfolioId: portfolio.id },
    });

    return await Promise.all(
      portfolioShares.map(async (portfolioShare) => {
        const share = await this.shareModel.findOne({
          where: { id: portfolioShare.shareId },
        });

        return {
          ...share.toJSON(),
          amount: portfolioShare.amount,
        };
      }),
    );
  }
}
