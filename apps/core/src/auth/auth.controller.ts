import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CurrentUser } from '@app/core-lib';
import {
  RegisterDto,
  LoginUserDto,
  RegisterPayloadDto,
  LoginPayloadDto,
  GoogleAuthPayloadDto,
} from './dto/auth.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { GoogleGuard } from '../guard/google.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await validateOrReject(body);
    const payload = plainToInstance(RegisterPayloadDto, { registerDto: body });
    await validateOrReject(payload);

    const result = await this.authService.register(payload.registerDto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.json({ accessToken: result.accessToken });
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await validateOrReject(body);
    const payload = plainToInstance(LoginPayloadDto, { loginUserDto: body });
    await validateOrReject(payload);

    const result = await this.authService.login(payload.loginUserDto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.json({ accessToken: result.accessToken });
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(
    @CurrentUser() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.generateTokens(userId);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.json({ accessToken: result.accessToken });
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  google() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request & { user: any },
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = plainToInstance(GoogleAuthPayloadDto, { user: req.user });
    await validateOrReject(payload);

    const result = await this.authService.googleAuth(payload.user);

    if (typeof result === 'string') {
      return res.redirect(
        `${this.configService.getOrThrow<string>('CLIENT_URL')}/error`,
      );
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.redirect(this.configService.getOrThrow<string>('CLIENT_URL'));
  }
}
