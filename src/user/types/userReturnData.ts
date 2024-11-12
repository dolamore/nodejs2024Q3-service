import { ApiProperty } from '@nestjs/swagger';

export class UserReturnData {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;
  @ApiProperty({ description: 'User login' })
  login: string;
  @ApiProperty({ description: 'Version of the user' })
  version: number;
  @ApiProperty({ description: 'Time when the user was created' })
  createdAt: Date;
  @ApiProperty({ description: 'Time when the user was last updated' })
  updatedAt: Date;
}
