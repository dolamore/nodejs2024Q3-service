import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepositoryInterface } from '../user/interfaces/user.repository.interface';
import { PrismaRefreshTokenRepository } from '../user/repositories/prisma-token.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private jwtService: JwtService,
    private prismaRefreshTokenRepository: PrismaRefreshTokenRepository,
  ) {}

  async signup(login: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.getUserByLogin(login);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.upsertUser(login, hashedPassword);

    return 'User successfully registered';
  }

  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.getUserByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, login: user.login };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    const expiresAt = new Date(
      Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION),
    );
    await this.prismaRefreshTokenRepository.upsertRefreshToken(
      user.id,
      refreshToken,
      expiresAt,
    );

    return { accessToken, refreshToken };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokenRecord =
        await this.prismaRefreshTokenRepository.getRefreshTokenByUserId(
          payload.userId,
        );

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const newPayload = { userId: payload.userId, login: payload.login };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      });

      await this.prismaRefreshTokenRepository.upsertRefreshToken(
        payload.userId,
        newRefreshToken,
        new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION)),
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
