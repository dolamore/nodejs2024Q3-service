import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({ description: 'Artist name' })
  name: string;
  @ApiProperty({ description: 'If artist has grammy' })
  grammy: boolean;
}
