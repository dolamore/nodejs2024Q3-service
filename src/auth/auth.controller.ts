import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: { login: string; password: string }) {
    const { login, password } = body;
    return this.authService.signup(login, password);
  }

  @Post('login')
  async login(@Body() body: { login: string; password: string }) {
    const { login, password } = body;
    return this.authService.login(login, password);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('protected')
  @UseGuards(AuthGuard())
  protectedRoute() {
    return { message: 'This is a protected route' };
  }
}
