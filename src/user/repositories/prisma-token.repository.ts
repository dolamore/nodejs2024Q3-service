import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../../../prisma/client';

@Injectable()
export class PrismaRefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async upsertRefreshToken(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });

    if (existingToken) {
      return this.prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: {
          token: refreshToken,
          expiresAt,
        },
      });
    }

    return this.prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        userId,
        token: refreshToken,
        expiresAt,
      },
    });
  }

  async getRefreshTokenByUserId(userId: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: { userId },
    });
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    const token = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });

    if (!token) {
      throw new NotFoundException(
        `Refresh token not found for user with id ${userId}`,
      );
    }

    await this.prisma.refreshToken.delete({
      where: { id: token.id },
    });
  }

  async isRefreshTokenExpired(userId: string): Promise<boolean> {
    const token = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });

    if (!token) {
      throw new NotFoundException(
        `Refresh token for user with id ${userId} not found`,
      );
    }

    return token.expiresAt < new Date();
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
