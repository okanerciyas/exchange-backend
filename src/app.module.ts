import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {
  PortfolioEntity,
  PortfolioSharesEntity,
  ShareEntity,
  TransactionEntity,
  UserEntity,
} from './entities';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { postgreConfig } from './configs/postgre.config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ShareModule } from './share/share.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...postgreConfig,
      synchronize: true,
      models: [
        PortfolioEntity,
        PortfolioSharesEntity,
        ShareEntity,
        UserEntity,
        TransactionEntity,
      ],
    }),
    UsersModule,
    AuthModule,
    PortfolioModule,
    ShareModule,
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
