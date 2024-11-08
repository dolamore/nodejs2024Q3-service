import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { validate } from 'uuid';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserReturnData } from '../types/userReturnData';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    const result = this.userService.findAll();
    return result instanceof Promise ? await result : result;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserReturnData> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const result = await this.userService.findOne(id);
    const user = result instanceof Promise ? await result : result;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.userService.create(createUserDto);
    const result = user instanceof Promise ? await user : user;

    return {
      id: result.id,
      login: result.login,
      version: result.version,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (
      !updatePasswordDto.oldPassword ||
      typeof updatePasswordDto.oldPassword !== 'string'
    ) {
      throw new BadRequestException('Login is required and must be a string');
    }
    if (
      !updatePasswordDto.newPassword ||
      typeof updatePasswordDto.newPassword !== 'string'
    ) {
      throw new BadRequestException(
        'Password is required and must be at least 6 characters',
      );
    }
    if (!validate(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const result = this.userService.findOne(id);
    const user = result instanceof Promise ? await result : result;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const result = await this.userService.findOne(id);
    const user = result instanceof Promise ? await result : result;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
    };
  }
}
