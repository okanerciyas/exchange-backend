import { Module } from '@nestjs/common';
import { TeamsService } from './services/teams.service';
import { TeamsController } from './controllers/teams.controller';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Team } from '../entities/team.entity';
import { TeamUsers } from '../entities/team-users.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Team, TeamUsers, User])],
  controllers: [TeamsController],
  providers: [TeamsService, AuthGuard, JwtService],
})
export class TeamsModule {}
