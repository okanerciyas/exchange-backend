import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { postgreConfig } from './configs/postgre.config';
import { TeamsModule } from './teams/teams.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { Team } from './entities/team.entity';
import { TeamUsers } from './entities/team-users.entity';
import { TodoModule } from './todo/todo.module';
import { Todo } from './entities/todo.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...postgreConfig,
      synchronize: true,
      models: [User, Team, TeamUsers, Todo],
    }),
    UsersModule,
    AuthModule,
    TeamsModule,
    TodoModule,
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
