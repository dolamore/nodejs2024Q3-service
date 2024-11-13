import { ApiProperty } from '@nestjs/swagger';

export interface Track {
  id: string;
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export class Track {
  @ApiProperty({ description: 'Unique identifier of the track' })
  id: string;
  @ApiProperty({ description: 'Track name' })
  name: string;
  @ApiProperty({ description: 'Track artist' })
  artistId: string | null;
  @ApiProperty({ description: 'Track album' })
  albumId: string | null;
  @ApiProperty({ description: 'Track duration' })
  duration: number;
}
