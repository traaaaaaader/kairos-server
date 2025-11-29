import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAccessGuard } from '@app/core-lib';
import { UsersService } from './users.service';
import { EditUserPayloadDto } from './dto/users.dto';

interface UserResponse {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
}

@UseGuards(JwtAccessGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get')
  async get(@CurrentUser() userId: string): Promise<UserResponse> {
    const user = await this.usersService.findOne({ id: userId });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    };
  }

  @Post('edit')
  async editUser(
    @CurrentUser() userId: string,
    @Body() body: EditUserPayloadDto,
  ): Promise<UserResponse> {
    const result = await this.usersService.edit({ userId, ...body });

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      imageUrl: result.imageUrl,
    };
  }
}
