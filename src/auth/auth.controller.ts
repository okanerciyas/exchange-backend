import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/set-metadata.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginData: { username: string; password: string }) {
    try {
      const response = await this.authService.login(
        loginData.username,
        loginData.password,
      );
      return response;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
