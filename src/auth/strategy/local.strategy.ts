import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../entities/user.entity';
import * as argon2 from 'argon2';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super();
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
