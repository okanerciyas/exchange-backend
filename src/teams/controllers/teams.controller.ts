import {
  Controller,
  Post,
  Body,
  Delete,
  Query,
  Req,
  Get,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { CreateTeamDto } from '../dto/create-team.dto';
import { RoleEnum } from '../../entities/user.entity';
import { Roles } from '../../auth/decorators/role.decorator';
import { AddMemberDto } from '../dto/add-member.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  findTeams(@Req() req: Request) {
    return this.teamsService.findTeams(req);
  }

  @Get('users')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  findUsers(@Query('teamId') teamId: string, @Req() req: Request) {
    return this.teamsService.findUsers(teamId, req);
  }

  @Post()
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  create(@Body() createTeamDto: CreateTeamDto, @Req() req: Request) {
    return this.teamsService.create(createTeamDto, req);
  }

  @Post('add-member')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  addUser(@Body() addMemberDto: AddMemberDto) {
    return this.teamsService.addUser(addMemberDto);
  }

  @Delete('remove-member')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  removeUser(@Query('userId') userId: string, @Query('teamId') teamId: string) {
    return this.teamsService.removeUser(userId, teamId);
  }
}
