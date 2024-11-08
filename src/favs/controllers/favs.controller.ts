import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavsService } from '../services/favs.service';
import { validate } from 'uuid';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  async getAllFavs() {
    return await this.favsService.getAllFavs();
  }

  @Post('artist/:id')
  async addArtistToFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.isArtistExist(id);
    return await this.favsService.addArtistToFavs(id);
  }

  @Post('album/:id')
  async addAlbumToFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.isAlbumExist(id);
    return await this.favsService.addAlbumToFavs(id);
  }

  @Post('track/:id')
  async addTrackToFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.isTrackExist(id);
    return await this.favsService.addTrackToFavs(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtistFromFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.validateArtistId(id);
    return await this.favsService.deleteArtistFromFavs(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbumFromFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.validateAlbumId(id);
    return await this.favsService.deleteAlbumFromFavs(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrackFromFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.validateTrackId(id);
    return await this.favsService.deleteTrackFromFavs(id);
  }

  validateId(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }
  }

  async validateTrackId(id: string) {
    const result = await this.favsService.isTrackExist(id);
    if (!result) {
      throw new NotFoundException('Track already not in favorites');
    }
  }

  async validateAlbumId(id: string) {
    const result = await this.favsService.isAlbumExist(id);
    if (!result) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  async validateArtistId(id: string) {
    const result = await this.favsService.isArtistExist(id);
    if (!result) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }

  async isAlbumExist(id: string) {
    const result = await this.favsService.isAlbumExist(id);
    if (!result) {
      throw new UnprocessableEntityException("Album wasn't found");
    }
  }

  async isArtistExist(id: string) {
    const result = await this.favsService.isArtistExist(id);
    if (!result) {
      throw new UnprocessableEntityException("Artist wasn't found");
    }
  }

  async isTrackExist(id: string) {
    const result = await this.favsService.isTrackExist(id);
    if (!result) {
      throw new UnprocessableEntityException("Track wasn't found");
    }
  }
}
