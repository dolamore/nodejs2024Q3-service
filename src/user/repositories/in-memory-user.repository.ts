import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { User } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    const result = this.users.find((user) => user.id === id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    return result;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    const user = this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    if (!updatePasswordDto) {
      throw new Error('No data provided');
    }

    if (updatePasswordDto.oldPassword !== user.password) {
      throw new Error('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;

    user.version++;
    user.updatedAt = Date.now();

    return user;
  }

  remove(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    this.users.splice(index, 1);
  }
}
