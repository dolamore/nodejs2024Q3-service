import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '../user/repositories/in-memory-user.repository';
import { InMemoryArtistRepository } from '../artist/repositories/in-memory-artist.repository';
import { InMemoryAlbumRepository } from '../album/repositories/in-memory-album.repository';
import { InMemoryTrackRepository } from '../track/repositories/in-memory-track.repository';
import { InMemoryFavsRepository } from '../favs/repositories/in-memory-favs.repository';

@Module({
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: InMemoryUserRepository,
    },
    {
      provide: 'ArtistRepositoryInterface',
      useClass: InMemoryArtistRepository,
    },
    {
      provide: 'AlbumRepositoryInterface',
      useClass: InMemoryAlbumRepository,
    },
    {
      provide: 'TrackRepositoryInterface',
      useClass: InMemoryTrackRepository,
    },
    {
      provide: 'FavsRepositoryInterface',
      useClass: InMemoryFavsRepository,
    },
  ],
  exports: [
    'UserRepositoryInterface',
    'ArtistRepositoryInterface',
    'AlbumRepositoryInterface',
    'TrackRepositoryInterface',
    'FavsRepositoryInterface',
  ],
})
export class RepositoryModule {}
