import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly localStrategy: LocalStrategy,
  ) {}
  createToken(user: User): string {
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

  async login(username: string, password: string): Promise<any> {
    const user = await this.localStrategy.validate(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.createToken(user);
    return { access_token: token };
  }
}
