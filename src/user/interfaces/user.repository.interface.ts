import { UpdatePasswordDto } from '../dto/update-password.dto';
import { User } from '../../../prisma/client';

export interface UserRepositoryInterface {
  upsertUser(login: string, password: string): Promise<User> | User;
  getAllUsers(): Promise<User[]> | User[];
  getUserById(id: string): Promise<User | undefined> | User;
  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> | User;
  deleteUser(id: string): Promise<void> | void;
}
