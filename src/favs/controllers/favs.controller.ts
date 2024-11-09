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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesResponse } from '../interfaces/favs.interface';

@ApiTags('Favorites')
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all favorites',
    type: FavoritesResponse,
  })
  async getAllFavs() {
    return await this.favsService.getAllFavs();
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiResponse({
    status: 201,
    description: 'Successfully added artist to favorites',
  })
  @ApiResponse({ status: 400, description: 'Invalid artist ID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async addArtistToFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.isArtistExist(id);
    return await this.favsService.addArtistToFavs(id);
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiResponse({
    status: 201,
    description: 'Successfully added album to favorites',
  })
  @ApiResponse({ status: 400, description: 'Invalid album ID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async addAlbumToFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.isAlbumExist(id);
    return await this.favsService.addAlbumToFavs(id);
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiResponse({
    status: 201,
    description: 'Successfully added track to favorites',
  })
  @ApiResponse({ status: 400, description: 'Invalid track ID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async addTrackToFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.isTrackExist(id);
    return await this.favsService.addTrackToFavs(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove artist from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Successfully removed artist from favorites',
  })
  @ApiResponse({ status: 400, description: 'Invalid artist ID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async deleteArtistFromFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.validateArtistId(id);
    return await this.favsService.deleteArtistFromFavs(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove album from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Successfully removed album from favorites',
  })
  @ApiResponse({ status: 400, description: 'Invalid album ID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async deleteAlbumFromFavs(@Param('id') id: string) {
    this.validateId(id);
    await this.validateAlbumId(id);
    return await this.favsService.deleteAlbumFromFavs(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove track from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Successfully removed track from favorites',
  })
  @ApiResponse({ status: 400, description: 'Invalid track ID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
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
