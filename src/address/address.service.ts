import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/CreateAddress.dto';

@Injectable()
export class AddressService {
  constructor(private prismaService: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, userId: number) {
    const existAddress = await this.prismaService.address.findMany({
      where: { userId },
    });

    if (existAddress.length > 0) {
      await this.prismaService.address.delete({
        where: { id: existAddress[0].id },
      });
    }

    return await this.prismaService.address.create({
      data: {
        userId,
        name: createAddressDto.name,
        latitude: createAddressDto.latitude,
        longitude: createAddressDto.longitude,
        range: createAddressDto.range,
      },
    });
  }

  async findFirst(userId: number) {
    const address = await this.prismaService.address.findFirst({
      where: { userId },
    });
    if (address) {
      return address;
    } else {
      return new NotFoundException();
    }
  }
}
