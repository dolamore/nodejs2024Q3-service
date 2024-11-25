import { ApiProperty } from '@nestjs/swagger';

export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;
  @ApiProperty({ description: 'User login' })
  login: string;
  @ApiProperty({ description: 'User password' })
  password: string;
  @ApiProperty({ description: 'User version' })
  version: number;
  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;
  @ApiProperty({ description: 'User update date' })
  updatedAt: Date;
}
