import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { User } from '../../../prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserReturnData } from '../types/userReturnData';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserReturnData> {
    const newUser = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return this.userToUserReturnData(newUser);
  }

  async findAll(): Promise<UserReturnData[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.userToUserReturnData(user));
  }

  async findOne(id: string): Promise<UserReturnData | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }
    return this.userToUserReturnData(user);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserReturnData> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(`Password is incorrect`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });

    return this.userToUserReturnData(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    await this.prisma.user.delete({ where: { id } });
  }

  private userToUserReturnData(user: User): UserReturnData {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }
}
