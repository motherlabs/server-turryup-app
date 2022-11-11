import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly status: string;
}
