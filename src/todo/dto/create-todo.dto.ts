import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { BaseDto } from './base.dto';

export class CreateTodoDto extends PartialType(BaseDto) {
  @IsString()
  teamId: string;
}
