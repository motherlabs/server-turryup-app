import { ApiProperty } from '@nestjs/swagger';
import { GenderType } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateInfoDto {
  @ApiProperty({ required: true, enum: GenderType })
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly birthYear: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly interestGoods: string;
}
