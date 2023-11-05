import { Injectable } from '@nestjs/common';
import { ShareEntity } from '../../entities';
import { InjectModel } from '@nestjs/sequelize';
import { CreateShareDto } from '../dto/create-share.dto';
import { UpdateShareDto } from '../dto/update-share.dto';

@Injectable()
export class ShareService {
  constructor(
    @InjectModel(ShareEntity)
    private readonly shareModel: typeof ShareEntity,
  ) {}

  async createShare(createShareDto: CreateShareDto) {
    const { symbol, ...rest } = createShareDto;
    const upperCaseSymbol = symbol.toUpperCase();
    return this.shareModel.create({ ...rest, symbol: upperCaseSymbol });
  }

  async updateShare(updateShareDto: UpdateShareDto) {
    const { id, ...rest } = updateShareDto;
    const updatedShare = await this.shareModel.update(
      { ...rest },
      { where: { id } },
    );

    if (updatedShare.length !== 1) {
      throw new Error('Share not found');
    }
    return updatedShare[0];
  }

  async findShares() {
    return this.shareModel.findAll();
  }
}
