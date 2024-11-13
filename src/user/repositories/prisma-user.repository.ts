import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserReturnData } from '../types/userReturnData';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async upsertUser(login: string, password: string): Promise<UserReturnData> {
    const user = await this.prisma.user.upsert({
      where: { login },
      update: {
        password: password,
        updatedAt: new Date(),
      },
      create: {
        id: uuidv4(),
        login,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async getAllUsers(): Promise<UserReturnData[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      return new UserReturnData({
        id: user.id,
        login: user.login,
        version: user.version,
        createdAt: Number(user.createdAt),
        updatedAt: Number(user.updatedAt),
      });
    });
  }

  async getUserById(id: string): Promise<UserReturnData | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return new UserReturnData({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    });
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

    return new UserReturnData({
      id: updatedUser.id,
      login: updatedUser.login,
      version: updatedUser.version,
      createdAt: Number(updatedUser.createdAt),
      updatedAt: Number(updatedUser.updatedAt),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
