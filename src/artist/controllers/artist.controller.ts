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
import { ArtistService } from '../services/artist.service';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { validate } from 'uuid';
import { UpdateArtistInfoDto } from '../dto/update-artist-info.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Artists')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all artists',
  })
  async getAllArtists() {
    return await this.artistService.getAllArtists();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved artist',
    type: CreateArtistDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid artist ID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async getArtistById(@Param('id') id: string) {
    this.validateId(id);
    await this.isArtistExist(id);
    const result = await this.artistService.getArtistById(id);
    if (!result) {
      throw new NotFoundException('Artist not found');
    }
    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new artist' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created artist',
    type: CreateArtistDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    this.validateCreateArtistDto(createArtistDto);

    return await this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist info' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated artist',
    type: CreateArtistDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid artist ID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistInfoDto,
  ) {
    this.validateId(id);
    this.validateUpdateArtistInfoDto(updateArtistDto);
    await this.isArtistExist(id);

    return await this.artistService.updateArtistInfo(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete artist by ID' })
  @ApiResponse({ status: 204, description: 'Successfully deleted artist' })
  @ApiResponse({ status: 400, description: 'Invalid artist ID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async deleteArtist(@Param('id') id: string) {
    this.validateId(id);
    await this.isArtistExist(id);
    return await this.artistService.deleteArtist(id);
  }

  validateId(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }
  }

  async isArtistExist(id: string) {
    const result = await this.artistService.getArtistById(id);
    if (!result) {
      throw new NotFoundException("Artist wasn't found");
    }
  }

  validateCreateArtistDto(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new BadRequestException('Missing required fields');
    }
  }

  validateUpdateArtistInfoDto(updateArtistInfoDto: UpdateArtistInfoDto) {
    if (
      !updateArtistInfoDto.name &&
      !updateArtistInfoDto.grammy &&
      updateArtistInfoDto.name === ''
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (typeof updateArtistInfoDto.name !== 'string') {
      throw new BadRequestException('Name must be a string');
    }
  }
}
