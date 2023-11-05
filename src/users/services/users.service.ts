import {ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {RoleEnum, UserEntity} from '../../entities';
import {InjectModel} from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import {UpdateUserDto} from '../dto/update-user.dto';
import {Op} from 'sequelize';
import {AddMoneyDto} from '../dto/add-money.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity)
    private readonly userModel: typeof UserEntity,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { password, username, email } = createUserDto;

    const userWithSameCredentials = await this.userModel.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (userWithSameCredentials) {
      throw new ConflictException('UserEntity already exists');
    }

    const hashedPassword = await argon2.hash(password);

    const user = await this.userModel.create({
      username,
      email,
      balance: 0,
      password: hashedPassword,
    });

    const userPlainObject = user.get({ plain: true });

    delete userPlainObject.password;

    return userPlainObject;
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('UserEntity not found');
    }
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('UserEntity not found');
    }
    return user;
  }

  async findUsers(): Promise<UserEntity[]> {
    const users = await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });

    const filteredUsers = users
      .map((user) => user.get({ plain: true }))
      .filter((user) => !user.roles.includes(RoleEnum.SUPER_ADMIN));

    return filteredUsers;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    currUser: any,
  ): Promise<UserEntity> {
    const { username, email } = updateUserDto;
    let { password } = updateUserDto;

    if (password) {
      password = await argon2.hash(password);
    }

    const user = await this.userModel.findOne({ where: { id: currUser.sub } });
    if (!user) {
      throw new NotFoundException('UserEntity not found');
    }

    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.password = password ?? user.password;

    await user.save();

    const userPlainObject = user.get({ plain: true });

    delete userPlainObject.password;

    return userPlainObject;
  }

  async updateAdminStatus(id: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('UserEntity not found');
    }
    user.roles = [...user.roles, RoleEnum.ADMIN];

    return await user.save();
  }

  async addMoney(addMoneyDto: AddMoneyDto, currUser: any) {
    const user = await this.userModel.findOne({ where: { id: currUser.sub } });
    if (!user) {
      throw new NotFoundException('UserEntity not found');
    }
    const { amount } = addMoneyDto;
    user.balance = parseFloat((Number(user.balance) + parseFloat(amount.toFixed(2))).toFixed(2));

    return await user.save();
  }
}
