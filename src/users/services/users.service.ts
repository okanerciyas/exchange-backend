import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleEnum, User } from '../../entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, username, email } = createUserDto;

    const userWithSameCredentials = await this.userModel.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (userWithSameCredentials) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await argon2.hash(password);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const userPlainObject = user.get({ plain: true });

    delete userPlainObject.password;

    return userPlainObject;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUsers(): Promise<User[]> {
    const users = await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });

    const filteredUsers = users
      .map((user) => user.get({ plain: true }))
      .filter((user) => !user.roles.includes(RoleEnum.SUPER_ADMIN));

    return filteredUsers;
  }

  async updateUser(updateUserDto: UpdateUserDto, currUser: any): Promise<User> {
    console.log(currUser.sub);
    const { username, email } = updateUserDto;
    let { password } = updateUserDto;

    if (password) {
      password = await argon2.hash(password);
    }

    const user = await this.userModel.findOne({ where: { id: currUser.sub } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.password = password ?? user.password;

    await user.save();

    const userPlainObject = user.get({ plain: true });

    delete userPlainObject.password;

    return userPlainObject;
  }

  async updateAdminStatus(id: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.roles = [...user.roles, RoleEnum.ADMIN];

    return await user.save();
  }
}
