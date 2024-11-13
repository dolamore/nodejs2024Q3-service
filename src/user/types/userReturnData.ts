import { ApiProperty } from '@nestjs/swagger';

export class UserReturnData {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;
  @ApiProperty({ description: 'User login' })
  login: string;
  @ApiProperty({ description: 'Version of the user' })
  version: number;
  @ApiProperty({ description: 'Time when the user was created' })
  createdAt: number;
  @ApiProperty({ description: 'Time when the user was last updated' })
  updatedAt: number;

  constructor(data: {
    id: string;
    login: string;
    version: number;
    createdAt: number;
    updatedAt: number;
  }) {
    this.id = data.id;
    this.login = data.login;
    this.version = data.version;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
