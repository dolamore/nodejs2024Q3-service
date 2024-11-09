import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({ description: 'Track name' })
  name: string;
  @ApiProperty({ description: 'Track artist' })
  artistId: string | null;
  @ApiProperty({ description: 'Track album' })
  albumId: string | null;
  @ApiProperty({ description: 'Track duration' })
  duration: number;
}
