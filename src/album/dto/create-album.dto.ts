import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({ description: 'Album name' })
  name: string;
  @ApiProperty({ description: 'Album year' })
  year: number;
  @ApiProperty({ description: 'Artist id' })
  artistId: string | null;
}
