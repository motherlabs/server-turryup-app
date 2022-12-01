import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly range: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly latitude: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly longitude: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly type: string;
}
