import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserReturnData } from '../types/userReturnData';
import { User } from '@prisma/client';

export interface UserRepositoryInterface {
  upsertUser(
    login: string,
    password: string,
  ): Promise<UserReturnData> | UserReturnData;

  getAllUsers(): Promise<UserReturnData[]> | UserReturnData[];

  getUserById(id: string): Promise<UserReturnData | undefined> | UserReturnData;

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserReturnData> | UserReturnData;

  deleteUser(id: string): Promise<void> | void;

  getUserByLogin(login: string): Promise<User | undefined> | User;
}
