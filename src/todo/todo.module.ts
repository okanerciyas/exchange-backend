import { Module } from '@nestjs/common';
import { TodoService } from './services/todo.service';
import { TodoController } from './controllers/todo.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Todo } from '../entities/todo.entity';
import { TeamUsers } from '../entities/team-users.entity';

@Module({
  imports: [SequelizeModule.forFeature([Todo, TeamUsers])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
