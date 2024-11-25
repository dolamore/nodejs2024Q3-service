import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private _info: any;
  canActivate(context: ExecutionContext) {
    // Дополнительная логика перед вызовом Guard (если нужна)
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this._info = info;
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
