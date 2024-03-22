import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  PortfolioEntity,
  PortfolioSharesEntity,
  ShareEntity,
  TransactionEntity,
  UserEntity,
} from 'src/entities';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USER') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'postgres',
        database: configService.get('DB_DATABASE') || 'eva',
        synchronize: true,
        models: [
          UserEntity,
          PortfolioEntity,
          ShareEntity,
          PortfolioSharesEntity,
          TransactionEntity,
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
