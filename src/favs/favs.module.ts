import { Module } from '@nestjs/common';
import { FavsController } from './controllers/favs.controller';
import { FavsService } from './services/favs.service';
import { RepositoryModule } from '../repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
