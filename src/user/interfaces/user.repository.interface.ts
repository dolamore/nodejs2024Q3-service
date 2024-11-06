import { User } from './user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

export interface UserRepositoryInterface {
  create(createUserDto: CreateUserDto): Promise<User> | User;
  findAll(): Promise<User[]> | User[];
  findOne(id: string): Promise<User | undefined> | User | undefined;
  update(id: string, updateUserDto: UpdatePasswordDto): Promise<User> | User;
  remove(id: string): Promise<void> | void;
}
