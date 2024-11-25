import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface User {
  userId: string;
  login: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = []; // Временное хранилище пользователей

  constructor(private jwtService: JwtService) {}

  async signup(login: string, password: string): Promise<string> {
    if (this.users.find((user) => user.login === login)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `${this.users.length + 1}`;
    this.users.push({ userId, login, password: hashedPassword });

    return 'User successfully registered';
  }

  async login(login: string, password: string) {
    const user = this.users.find((user) => user.login === login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.userId, login: user.login };

    const userAccessToken = this.jwtService.sign(payload);
    const userRefreshToken = this.jwtService.sign(payload, {
      secret: process.env.JJWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken: userAccessToken, refreshToken: userRefreshToken };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const newPayload = { userId: payload.userId, login: payload.login };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
