import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { User } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Генерация уникального ID для нового пользователя
    const id = uuidv4();

    // Создание нового пользователя
    const newUser: User = {
      id, // uuid v4
      login: createUserDto.login,
      password: createUserDto.password, // В реальном приложении пароль следует хешировать
      version: 1, // Начальный номер версии
      createdAt: Date.now(), // Время создания
      updatedAt: Date.now(), // Время последнего обновления (по умолчанию совпадает с созданием)
    };

    this.users.push(newUser); // Добавление нового пользователя в память
    return newUser; // Возвращение созданного пользователя
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User | undefined> {
    const result = this.users.find((user) => user.id === id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    return result;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (user) {
      user.password = updatePasswordDto.newPassword;
      return user;
    }
    throw new Error('User not found');
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} wasn't found`);
    }

    this.users.splice(index, 1);

    return Promise.resolve();
  }
}
