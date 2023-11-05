import { IsNotEmpty, IsNumber } from 'class-validator';
import {AddInPortfolioDto} from './add-in-portfolio.dto';
import {PartialType} from '@nestjs/mapped-types';

export class PortfolioDto extends PartialType(AddInPortfolioDto) {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
