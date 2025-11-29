import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/* -----------------------------------------
 * DTO для регистрации
 * ----------------------------------------- */
export class RegisterDto {
  @IsDefined({ message: 'Email обязателен' })
  @IsEmail({}, { message: 'Email должен быть корректным' })
  email: string;

  @IsDefined({ message: 'Имя обязательно' })
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  name: string;

  @IsDefined({ message: 'Пароль обязателен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @IsOptional()
  @IsString({ message: 'imageUrl должен быть строкой' })
  imageUrl?: string;
}

/* -----------------------------------------
 * DTO для логина
 * ----------------------------------------- */
export class LoginUserDto {
  @IsDefined({ message: 'Email обязателен' })
  @IsEmail({}, { message: 'Email должен быть корректным' })
  email: string;

  @IsDefined({ message: 'Пароль обязателен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;
}

/* -----------------------------------------
 * Payload DTO для сервиса
 * ----------------------------------------- */
export class RegisterPayloadDto {
  @IsDefined({ message: 'registerDto обязателен' })
  registerDto: RegisterDto;
}

export class LoginPayloadDto {
  @IsDefined({ message: 'loginUserDto обязателен' })
  loginUserDto: LoginUserDto;
}

export class GoogleAuthPayloadDto {
  @IsDefined({ message: 'user обязателен' })
  user: any; // можно заменить на CreateUserDto, если есть общий тип
}
