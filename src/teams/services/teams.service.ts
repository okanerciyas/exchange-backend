import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTeamDto } from '../dto/create-team.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from '../../entities/team.entity';
import { TeamUsers } from '../../entities/team-users.entity';
import { AddMemberDto } from '../dto/add-member.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team)
    private readonly teamModel: typeof Team,

    @InjectModel(TeamUsers)
    private readonly teamUsersModel: typeof TeamUsers,

    @InjectModel(User)
    private readonly user: typeof User,
  ) {}

  async findTeams(req: any) {
    const userId = await this.user
      .findOne({ where: { username: req.user.username } })
      .then((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user.id;
      });
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const teamIds = await this.teamUsersModel
      .findAll({ where: { userId: req.user.sub } })
      .then((teamUsers) => {
        if (!teamUsers) {
          throw new NotFoundException('Team user not found');
        }
        return teamUsers.map((teamUser) => {
          return teamUser.teamId;
        });
      });

    return await this.teamModel.findAll({ where: { id: teamIds } });
  }

  async findUsers(teamId: string, req: any) {
    const team = await this.teamModel.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    await this.teamUsersModel
      .findOne({ where: { userId: req.user.sub } })
      .then((teamUser) => {
        if (!teamUser) {
          throw new ForbiddenException('User is not a member of this team');
        }
      });

    const userIds = await this.teamUsersModel
      .findAll({ where: { teamId } })
      .then((teamUsers) => {
        if (!teamUsers) {
          throw new NotFoundException('Team user not found');
        }
        return teamUsers.map((teamUser) => {
          return teamUser.userId;
        });
      });

    return await this.user.findAll({ where: { id: userIds } });
  }
  async create(createTeamDto: CreateTeamDto, req: any) {
    const { name } = createTeamDto;
    const team = await this.teamModel.create({
      name,
    });
    await this.addUser({ username: req.user.username, teamId: team.id });
    return team;
  }

  async addUser(addMemberDto: AddMemberDto) {
    const { username, teamId } = addMemberDto;
    const team = await this.teamModel.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const userId = await this.user
      .findOne({ where: { username } })
      .then((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user.id;
      });

    await this.teamUsersModel
      .findOne({
        where: { userId, teamId },
      })
      .then((teamUser) => {
        if (teamUser) {
          throw new ConflictException('Team user already exists');
        }
      });

    return await this.teamUsersModel.create({
      userId,
      teamId,
    });
  }

  async removeUser(userId: string, teamId: string) {
    const teamUser = await this.teamUsersModel.findOne({
      where: { userId, teamId },
    });
    if (!teamUser) {
      throw new NotFoundException('Team user not found');
    }
    return await this.teamUsersModel.destroy({ where: { userId } });
  }
}
