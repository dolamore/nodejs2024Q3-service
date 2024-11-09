import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserReturnData } from '../types/userReturnData';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserReturnData> {
    const result = this.userRepository.create(createUserDto);
    return result instanceof Promise ? await result : result;
  }

  async findAll(): Promise<UserReturnData[]> {
    const result = this.userRepository.findAll();
    return result instanceof Promise ? await result : result;
  }

  async findOne(id: string): Promise<UserReturnData | undefined> {
    const result = this.userRepository.findOne(id);
    return result instanceof Promise ? await result : result;
  }

  async delete(id: string): Promise<void> {
    const result = this.userRepository.delete(id);
    return result instanceof Promise ? await result : result;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserReturnData> {
    const result = this.userRepository.updatePassword(id, updatePasswordDto);
    return result instanceof Promise ? await result : result;
  }
}
