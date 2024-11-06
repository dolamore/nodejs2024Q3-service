import { User } from './user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

export interface UserRepositoryInterface {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | undefined>;
  create(user: CreateUserDto): Promise<User>;
  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User>;
  delete(id: string): Promise<void>;
}
