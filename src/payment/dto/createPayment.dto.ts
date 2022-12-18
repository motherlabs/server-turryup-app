import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly amount: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly method: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly merchant_uid: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly imp_uid: string;
}
