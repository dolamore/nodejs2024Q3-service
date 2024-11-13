import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { User } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserReturnData } from '../types/userReturnData';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = [];

  upsertUser(login: string, password: string): UserReturnData {
    const newUser: User = {
      id: uuidv4(),
      login: login,
      password: password,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return this.userToUserReturnData(newUser);
  }

  getAllUsers(): UserReturnData[] {
    return [...this.users.map((user) => this.userToUserReturnData(user))];
  }

  getUserById(id: string): UserReturnData | undefined {
    const result = this.users.find((user) => user.id === id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    return this.userToUserReturnData(result);
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): UserReturnData {
    if (!this.validatePassword(id, updatePasswordDto.oldPassword)) {
      throw new ForbiddenException(`Password is incorrect`);
    }
    const user = this.users.find((user) => user.id === id);
    if (user) {
      user.password = updatePasswordDto.newPassword;
      user.version += 1;
      user.updatedAt = new Date();
      return this.userToUserReturnData(user);
    }
    throw new NotFoundException(`User with id ${id} wasn't found`);
  }

  deleteUser(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    this.users.splice(index, 1);
  }

  userToUserReturnData(user: User): UserReturnData {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  validatePassword(userId: string, password: string): boolean {
    const user = this.users.find((user) => user.id === userId);
    return user ? user.password === password : false;
  }
}
