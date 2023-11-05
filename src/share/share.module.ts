import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShareEntity } from '../entities';
import { ShareController } from './controllers/share.controller';
import { ShareService } from './services/share.service';

@Module({
  imports: [SequelizeModule.forFeature([ShareEntity])],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
