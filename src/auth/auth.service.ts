import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepositoryInterface } from '../user/interfaces/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private jwtService: JwtService,
  ) {}

  async signup(login: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.getUserByLogin(login);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.upsertUser(login, hashedPassword);

    return 'User successfully registered';
  }

  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Ищем пользователя в базе данных
    const user = await this.userRepository.getUserByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Генерируем токены
    const payload = { userId: user.id, login: user.login };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newPayload = { userId: payload.userId, login: payload.login };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
