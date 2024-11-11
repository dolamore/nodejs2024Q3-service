import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserReturnData } from '../types/userReturnData';

export interface UserRepositoryInterface {
  findAll(): Promise<UserReturnData[]> | UserReturnData[];
  findOne(id: string): Promise<UserReturnData | undefined> | UserReturnData;
  create(user: CreateUserDto): Promise<UserReturnData> | UserReturnData;
  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserReturnData> | UserReturnData;
  delete(id: string): Promise<void> | void;
}
