import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtConstants } from './constants';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly localStrategy: LocalStrategy,
  ) {}
  createToken(user: UserEntity): string {
    const payload = {
      username: user.username,
      roles: user.roles,
      sub: user.id,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: jwtConstants.secret,
    });
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.localStrategy.validate(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.createToken(user);
    return { access_token: token };
  }
}
