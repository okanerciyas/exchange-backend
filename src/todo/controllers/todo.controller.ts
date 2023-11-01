import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../entities/user.entity';
import { Request } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    return this.todoService.create(createTodoDto, req.user);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get('private-todos')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  findPrivateTodos(@Req() req: Request) {
    return this.todoService.findPrivateTodos(req.user);
  }

  @Get('/team-todos')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  findTeamsTodos(
    @Query('teamId') teamId: string,
    @Query('userId') userId: string,
  ) {
    return this.todoService.findTeamsTodos(teamId, userId);
  }

  @Patch('')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  update(@Query('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete('')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  remove(@Query('id') id: string) {
    return this.todoService.remove(id);
  }
}
