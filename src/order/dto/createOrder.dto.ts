import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly paymentId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly storeId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly goodsId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly quantity: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly orderNumber: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly status: string;
}
