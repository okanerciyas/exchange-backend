import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { UserEntity } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    SequelizeModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, LocalStrategy, UsersService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
