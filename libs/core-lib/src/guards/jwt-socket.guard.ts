import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class JwtSocketGuard extends AuthGuard('jwt-socket') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token: string | string[] = client.handshake.auth.token;

    if (token === undefined) {
      throw new UnauthorizedException('Not unauthorized');
    }

    const authtoken: string = Array.isArray(token) ? token[0] : token;
    client.data.token = authtoken;

    return super.canActivate(context);
  }
}
