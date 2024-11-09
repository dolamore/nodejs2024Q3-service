import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrackService } from '../services/track.service';
import { validate } from 'uuid';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackInfoDto } from '../dto/update-track-info.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Track } from '../interfaces/track.interface';

@ApiTags('Tracks')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all tracks',
  })
  async getAllTracks() {
    return await this.trackService.getAllTracks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved track',
    type: Track,
  })
  @ApiResponse({ status: 400, description: 'Invalid track ID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async getTrackById(@Param('id') id: string) {
    this.validateId(id);
    await this.isTrackExist(id);
    const result = await this.trackService.getTrackById(id);
    if (!result) {
      throw new NotFoundException("Track wasn't found");
    }
    return result;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new track' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created track',
    type: Track,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    this.validateCreateTrackDto(createTrackDto);

    if (createTrackDto.albumId !== null) {
      await this.isAlbumExist(createTrackDto.albumId);
    }

    if (createTrackDto.artistId !== null) {
      await this.isArtistExist(createTrackDto.artistId);
    }

    return await this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track info' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated track',
    type: Track,
  })
  @ApiResponse({ status: 400, description: 'Invalid track ID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackInfoDto: UpdateTrackInfoDto,
  ) {
    this.validateId(id);
    await this.isTrackExist(id);
    this.validateUpdateTrackInfoDto(updateTrackInfoDto);

    if (
      updateTrackInfoDto.albumId !== null &&
      updateTrackInfoDto.albumId !== undefined
    ) {
      await this.isAlbumExist(updateTrackInfoDto.albumId);
    }

    return await this.trackService.updateTrackInfo(id, updateTrackInfoDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete track by ID' })
  @ApiResponse({ status: 204, description: 'Successfully deleted track' })
  @ApiResponse({ status: 400, description: 'Invalid track ID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async deleteTrack(@Param('id') id: string) {
    this.validateId(id);
    await this.isTrackExist(id);

    return await this.trackService.deleteTrack(id);
  }

  validateId(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }
  }

  async isTrackExist(id: string) {
    const track = await this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException("Track wasn't found");
    }
  }

  async isAlbumExist(id: string) {
    const album = await this.trackService.isAlbumExist(id);
    if (!album) {
      throw new NotFoundException("Album wasn't found");
    }
  }

  async isArtistExist(id: string) {
    const artist = await this.trackService.isArtistExist(id);
    if (!artist) {
      throw new NotFoundException("Artist wasn't found");
    }
  }

  validateCreateTrackDto(createTrackDto: CreateTrackDto) {
    if (
      !createTrackDto.name ||
      !createTrackDto.duration ||
      createTrackDto.albumId === undefined ||
      createTrackDto.artistId === undefined
    ) {
      throw new BadRequestException('Missing required fields');
    }
  }

  validateUpdateTrackInfoDto(updateTrackInfoDto: UpdateTrackInfoDto) {
    if (
      !updateTrackInfoDto.name ||
      !updateTrackInfoDto.duration ||
      updateTrackInfoDto.albumId === undefined ||
      updateTrackInfoDto.artistId === undefined
    ) {
      throw new BadRequestException('Invalid track data');
    }

    if (typeof updateTrackInfoDto.duration !== 'number') {
      throw new BadRequestException('Invalid track duration');
    }

    if (
      typeof updateTrackInfoDto.name !== 'string' &&
      updateTrackInfoDto.name
    ) {
      throw new BadRequestException('Invalid track name');
    }

    if (
      !validate(updateTrackInfoDto.albumId) &&
      updateTrackInfoDto.albumId !== null
    ) {
      throw new BadRequestException('Invalid album ID');
    }

    if (
      !validate(updateTrackInfoDto.artistId) &&
      updateTrackInfoDto.artistId !== null
    ) {
      throw new BadRequestException('Invalid artist ID');
    }
  }
}
