import {Body, Controller, Get, Patch, Post} from '@nestjs/common';
import {Roles} from '../../auth/decorators/role.decorator';
import {RoleEnum} from '../../entities';
import {ShareService} from '../services/share.service';
import {CreateShareDto} from '../dto/create-share.dto';
import {UpdateShareDto} from '../dto/update-share.dto';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async registerUser(@Body() createShareDto: CreateShareDto) {
    return this.shareService.createShare(createShareDto);
  }

  @Patch('update')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async updateUser(@Body() updateShareDto: UpdateShareDto) {
    return this.shareService.updateShare(updateShareDto);
  }

  @Get('all')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async findAll() {
    return this.shareService.findShares();
  }
}
