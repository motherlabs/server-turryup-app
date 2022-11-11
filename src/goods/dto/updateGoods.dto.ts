import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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

  // @ApiProperty({ required: true })
  // @IsNotEmpty()
  // readonly deleteImageIdList: string;

  // @ApiProperty({ required: true })
  // @IsNotEmpty()
  // readonly deleteImageLocationList: string;

  // @ApiProperty({
  //   items: { type: 'string', format: 'binary' },
  //   type: 'array',
  //   required: true,
  // })
  // readonly image;
}
