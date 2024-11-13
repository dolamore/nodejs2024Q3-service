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
    return await this.userService.getAllUsers();
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
    this.validateId(id);
    await this.isUserExist(id);

    const user = await this.userService.getUserById(id);

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
    this.validateCreateUserDto(createUserDto);

    return await this.userService.createUser(createUserDto);
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
      throw new BadRequestException('Password is required');
    }
    if (!validate(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const result = this.userService.getUserById(id);
    const user = result instanceof Promise ? await result : result;

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resultUpdatePassword = await this.userService.updatePassword(
      id,
      updatePasswordDto,
    );

    return {
      id: resultUpdatePassword.id,
      login: resultUpdatePassword.login,
      version: resultUpdatePassword.version,
      createdAt: resultUpdatePassword.createdAt,
      updatedAt: resultUpdatePassword.updatedAt,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'Successfully deleted user' })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    this.validateId(id);
    await this.isUserExist(id);

    return await this.userService.deleteUser(id);
  }

  validateId(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid user ID');
    }
  }

  async isUserExist(id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException("User wasn't found");
    }
  }

  validateCreateUserDto(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }
  }
}
