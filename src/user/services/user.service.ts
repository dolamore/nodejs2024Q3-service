import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    const user = await this.findOne(userId);
    return user ? user.password === password : false;
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const user = await this.findOne(id);
    if (user) {
      user.password = newPassword;
      user.version += 1;
      user.updatedAt = Date.now();
      return user;
    }
    return null;
  }
}
