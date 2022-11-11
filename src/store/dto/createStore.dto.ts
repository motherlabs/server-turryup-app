import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly userId: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly storeNumber: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly roadNameAddress: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly detailAddress: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly picupZone: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly businessHours: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly dayOff: string;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly latitude: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly longitude: number;
}
