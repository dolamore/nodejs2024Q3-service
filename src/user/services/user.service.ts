import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserReturnData } from '../types/userReturnData';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserReturnData> {
    return this.userRepository.upsertUser(
      createUserDto.login,
      createUserDto.password,
    );
  }

  async getAllUsers(): Promise<UserReturnData[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<UserReturnData | undefined> {
    return this.userRepository.getUserById(id);
  }

  async deleteUser(id: string): Promise<void> {
    this.userRepository.deleteUser(id);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserReturnData> {
    return this.userRepository.updatePassword(id, updatePasswordDto);
  }
}
