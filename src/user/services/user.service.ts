import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
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

  async update(id: string, updateUserDto: UpdatePasswordDto): Promise<User> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    this.userRepository.remove(id);
  }
}
