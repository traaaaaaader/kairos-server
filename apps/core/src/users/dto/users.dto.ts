import {
  IsDefined,
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  MinLength,
} from 'class-validator';

/* -----------------------------------------
 * Create User DTO (для регистрации через форму)
 * ----------------------------------------- */
export class CreateUserDto {
  @IsDefined({ message: 'email обязателен' })
  @IsEmail({}, { message: 'email должен быть корректным' })
  email: string;

  @IsDefined({ message: 'password обязателен' })
  @IsString({ message: 'password должен быть строкой' })
  @MinLength(6, { message: 'password должен содержать минимум 6 символов' })
  password: string;

  @IsDefined({ message: 'name обязателен' })
  @IsString({ message: 'name должен быть строкой' })
  @MinLength(1, { message: 'name должен содержать минимум 1 символ' })
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'imageUrl должен быть корректным URL' })
  imageUrl?: string;
}

/* -----------------------------------------
 * Login User DTO
 * ----------------------------------------- */
export class LoginUserDto {
  @IsDefined({ message: 'email обязателен' })
  @IsEmail({}, { message: 'email должен быть корректным' })
  email: string;

  @IsDefined({ message: 'password обязателен' })
  @IsString({ message: 'password должен быть строкой' })
  password: string;
}

/* -----------------------------------------
 * Register DTO (можно использовать как алиас CreateUserDto)
 * ----------------------------------------- */
export class RegisterDto extends CreateUserDto {}

/* -----------------------------------------
 * Edit User DTO
 * ----------------------------------------- */
export class EditUserPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsString({ message: 'userId должен быть строкой' })
  userId: string;

  @IsOptional()
  @IsString({ message: 'name должно быть строкой' })
  @MinLength(1, { message: 'name должно содержать минимум 1 символ' })
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'imageUrl должен быть корректным URL' })
  imageUrl?: string;
}

/* -----------------------------------------
 * Find User DTO
 * ----------------------------------------- */
export class FindUserPayloadDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email должен быть корректным email' })
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
