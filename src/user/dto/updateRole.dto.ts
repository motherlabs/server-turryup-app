import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class UpdateRoleDto {
  @IsNumber()
  @ApiProperty({ required: true })
  readonly userId: number;

  @IsEnum(UserRole)
  @ApiProperty({ required: true, enum: ['USER', 'ADMIN', 'PARTNER'] })
  readonly role: UserRole;
}
