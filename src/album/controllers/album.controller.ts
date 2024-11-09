import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { validate } from 'uuid';
import { AlbumService } from '../services/album.service';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumInfoDto } from '../dto/update-album-info.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all albums',
  })
  async getAllAlbums() {
    return await this.albumService.getAllAlbums();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved album',
    type: CreateAlbumDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid album ID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async getAlbumById(@Param('id') id: string) {
    this.validateId(id);
    await this.isAlbumExist(id);
    const result = await this.albumService.getAlbumById(id);
    if (!result) {
      throw new NotFoundException("Album wasn't found");
    }
    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new album' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created album',
    type: CreateAlbumDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    this.validateCreateAlbumDto(createAlbumDto);

    return await this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album info' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated album',
    type: CreateAlbumDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid album ID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumInfoDto: UpdateAlbumInfoDto,
  ) {
    this.validateId(id);
    this.validateUpdateAlbumInfoDto(updateAlbumInfoDto);
    await this.isAlbumExist(id);

    return await this.albumService.updateAlbumInfo(id, updateAlbumInfoDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete album by ID' })
  @ApiResponse({ status: 204, description: 'Successfully deleted album' })
  @ApiResponse({ status: 400, description: 'Invalid album ID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async deleteAlbum(@Param('id') id: string) {
    this.validateId(id);
    await this.isAlbumExist(id);

    return await this.albumService.deleteAlbum(id);
  }

  validateId(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }
  }

  async isAlbumExist(id: string) {
    const result = await this.albumService.getAlbumById(id);
    if (!result) {
      throw new NotFoundException("Album wasn't found");
    }
  }

  validateCreateAlbumDto(createAlbumDto: CreateAlbumDto) {
    if (
      !createAlbumDto.name ||
      !createAlbumDto.year ||
      createAlbumDto.artistId === undefined
    ) {
      throw new BadRequestException('Missing required fields');
    }
  }

  validateUpdateAlbumInfoDto(updateAlbumInfoDto: UpdateAlbumInfoDto) {
    if (
      !updateAlbumInfoDto.name &&
      !updateAlbumInfoDto.year &&
      updateAlbumInfoDto.name === '' &&
      updateAlbumInfoDto.artistId === undefined
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (typeof updateAlbumInfoDto.name !== 'string') {
      throw new BadRequestException('Name must be a string');
    }

    if (typeof updateAlbumInfoDto.year !== 'number') {
      throw new BadRequestException('Year must be a number');
    }

    if (
      !validate(updateAlbumInfoDto.artistId) &&
      updateAlbumInfoDto.artistId !== null
    ) {
      throw new BadRequestException('Invalid artist ID');
    }
  }
}
