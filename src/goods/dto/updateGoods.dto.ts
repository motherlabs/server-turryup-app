import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateGoodsDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly originPrice: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly categoryId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly salePrice: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly discount: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly expiryDate: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly quantity: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly isAutoDiscount: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly deleteImageIdList: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly deleteImageLocationList: string;

  @ApiProperty({
    items: { type: 'string', format: 'binary' },
    type: 'array',
    required: false,
  })
  readonly image;
}
