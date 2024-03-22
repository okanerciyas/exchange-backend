import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PortfolioService } from '../services/portfolio.service';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../entities';
import { PortfolioDto } from '../dto/portfolio.dto';
import { Request } from 'express';
import { AddInPortfolioDto } from '../dto/add-in-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('create')
  @Roles(RoleEnum.USER)
  async registerUser(@Req() req: Request) {
    return this.portfolioService.createPortfolio(req.user);
  }

  @Post('buy')
  @Roles(RoleEnum.USER)
  async addInPortfolio(
    @Body() addInPortfolio: PortfolioDto,
    @Req() req: Request,
  ) {
    return this.portfolioService.buyShare(addInPortfolio, req.user);
  }

  @Post('sell')
  @Roles(RoleEnum.USER)
  async sellSharePortfolio(
    @Body() addInPortfolio: PortfolioDto,
    @Req() req: Request,
  ) {
    return this.portfolioService.sellShare(addInPortfolio, req.user);
  }

  @Post('add')
  @Roles(RoleEnum.USER)
  async addShareInPortfolio(
    @Body() addInPortfolio: AddInPortfolioDto,
    @Req() req: Request,
  ) {
    return this.portfolioService.addShareInPortfolio(addInPortfolio, req.user);
  }

  @Get('all')
  @Roles(RoleEnum.USER)
  async getAllPortfolio(@Req() req: Request) {
    return this.portfolioService.getAllPortfolio(req.user);
  }
}
