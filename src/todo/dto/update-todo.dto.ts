import { PartialType } from '@nestjs/mapped-types';
import { BaseDto } from './base.dto';

export class UpdateTodoDto extends PartialType(BaseDto) {}
