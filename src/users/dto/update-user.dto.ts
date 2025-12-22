import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string | null;
}

// Partial update DTO for flexible updates
export class PartialUpdateUserDto {
  refreshToken?: string | null;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
