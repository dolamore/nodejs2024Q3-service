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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users' })
  async getAllUsers() {
    const result = this.userService.findAll();
    return result instanceof Promise ? await result : result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user',
    type: UserReturnData,
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created user',
    type: UserReturnData,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
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
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user',
    type: UserReturnData,
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Incorrect old password' })
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
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'Successfully deleted user' })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
