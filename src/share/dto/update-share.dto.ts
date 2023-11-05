import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateShareDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsNumber()
  @IsOptional()
  price: number;
}
