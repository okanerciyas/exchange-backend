import { TodoStatusEnum } from '../../entities/todo.entity';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

export class BaseDto {
  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsEnum(TodoStatusEnum)
  status: TodoStatusEnum;

  @IsBoolean()
  isPrivate: boolean;
}
