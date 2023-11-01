import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Todo, TodoStatusEnum } from '../../entities/todo.entity';
import { TeamUsers } from '../../entities/team-users.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private readonly todoModel: typeof Todo,

    @InjectModel(TeamUsers)
    private readonly teamUsersModel: typeof TeamUsers,
  ) {}
  async create(createTodoDto: CreateTodoDto, currUser: any) {
    const teamUser = await this.teamUsersModel.findOne({
      where: { userId: currUser.sub, teamId: createTodoDto.teamId },
    });

    if (!teamUser) {
      throw new ForbiddenException('User is not a member of this team');
    }

    const { teamId, title, summary, status, isPrivate } = createTodoDto;
    return await this.todoModel.create({
      teamId,
      userId: currUser.sub,
      title,
      summary,
      status,
      isPrivate,
    });
  }

  async findAll() {
    return await this.todoModel.findAll();
  }

  async findPrivateTodos(user: any) {
    const todos = await this.todoModel.findAll({
      where: { userId: user.sub, isPrivate: true },
    });
    if (!todos) {
      throw new ForbiddenException('Todo not found');
    }
    return todos;
  }

  async findTeamsTodos(teamId: string, userId: string) {
    const whereCondition: { teamId: string; userId?: string } = {
      teamId,
    };

    if (userId !== undefined && userId !== null) {
      whereCondition.userId = userId;
    }

    const todos = await this.todoModel.findAll({
      where: whereCondition,
    });

    if (!todos || todos.length === 0) {
      throw new ForbiddenException('Team not found');
    }
    return todos;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoModel.findByPk(id);
    if (!todo) {
      throw new ForbiddenException('Todo not found');
    }
    const { title, summary, status, isPrivate } = updateTodoDto;
    todo.title = title ?? '';
    todo.summary = summary ?? '';
    todo.status = status ?? TodoStatusEnum.NEEDS_ACTION;
    todo.isPrivate = isPrivate ?? false;
    return await todo.save();
  }

  async remove(id: string) {
    const todo = await this.todoModel.findByPk(id);
    if (!todo) {
      throw new ForbiddenException('Todo not found');
    }
    await todo.destroy();
    return HttpStatus.OK;
  }
}
