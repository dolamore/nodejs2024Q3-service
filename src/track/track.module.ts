import { Module } from '@nestjs/common';
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.service';
import { RepositoryModule } from '../repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
