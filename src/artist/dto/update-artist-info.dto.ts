import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistInfoDto {
  @ApiProperty({ description: 'Artist name' })
  name?: string;
  @ApiProperty({ description: 'If artist has grammy' })
  grammy?: boolean;
}
