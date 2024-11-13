import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User login' })
  login: string;
  @ApiProperty({ description: 'User password' })
  password: string;
}
