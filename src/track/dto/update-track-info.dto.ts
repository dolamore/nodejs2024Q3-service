import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackInfoDto {
  @ApiProperty({ description: 'Track name' })
  name?: string;
  @ApiProperty({ description: 'Track artist ID' })
  artistId?: string | null;
  @ApiProperty({ description: 'Track album id' })
  albumId?: string | null;
  @ApiProperty({ description: 'Track duration' })
  duration?: number;
}
