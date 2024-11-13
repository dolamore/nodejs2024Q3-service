import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Old password' })
  oldPassword: string;
  @ApiProperty({ description: 'New password' })
  newPassword: string;
}
