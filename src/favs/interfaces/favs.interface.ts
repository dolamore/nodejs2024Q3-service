import { Album } from '../../album/interfaces/album.interface';
import { Track } from '../../track/interfaces/track.interface';
import { Artist } from '../../artist/interfaces/artist.interface';
import { ApiProperty } from '@nestjs/swagger';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export class FavoritesResponse {
  @ApiProperty({ description: 'List of artists' })
  artists: Artist[];
  @ApiProperty({ description: 'List of albums' })
  albums: Album[];
  @ApiProperty({ description: 'List of tracks' })
  tracks: Track[];
}
