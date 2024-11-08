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

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAllAlbums() {
    return await this.albumService.getAllAlbums();
  }

  @Get(':id')
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
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    this.validateCreateAlbumDto(createAlbumDto);

    return await this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
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
