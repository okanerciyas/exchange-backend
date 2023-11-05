import {Body, Controller, Get, Patch, Post, Put, Query, Req} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../../auth/decorators/set-metadata.decorator';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../entities';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Request } from 'express';
import {AddMoneyDto} from '../dto/add-money.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Public()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.updateUser(updateUserDto, req.user);
  }

  @Put('add-money')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async addMoney(@Body() addMoneyDto: AddMoneyDto, @Req() req: Request) {
    return this.usersService.addMoney(addMoneyDto, req.user);
  }

  @Get('all')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async findAll() {
    return this.usersService.findUsers();
  }

  @Patch('/make-admin')
  @Roles(RoleEnum.SUPER_ADMIN)
  async findOne(@Query('id') id: string) {
    return this.usersService.updateAdminStatus(id);
  }
}
