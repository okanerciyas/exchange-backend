import { IsString, IsNotEmpty } from 'class-validator';

export class AddInPortfolioDto {
    @IsString()
    @IsNotEmpty()
    shareId: string;
}
