import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/createAddress.dto';

@Injectable()
export class AddressService {
  constructor(private prismaService: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, userId: number) {
    const existAddress = await this.prismaService.address.findMany({
      where: { userId, name: createAddressDto.name },
    });

    if (createAddressDto.type === 'HOME') {
      const myHomeAddress = await this.prismaService.address.findMany({
        where: { userId, type: 'HOME' },
      });
      if (myHomeAddress.length > 0) {
        const myHomeIdList: number[] = [];
        myHomeAddress.map((v) => {
          myHomeIdList.push(v.id);
        });
        await this.prismaService.address.updateMany({
          where: { id: { in: myHomeIdList } },
          data: { type: 'NORMAL' },
        });
      }
    }

    const pinnedAddress = await this.prismaService.address.findMany({
      where: { userId, isPinned: 1 },
    });
    if (pinnedAddress.length > 0) {
      const pinnedIdList: number[] = [];
      pinnedAddress.map((v) => {
        pinnedIdList.push(v.id);
      });
      await this.prismaService.address.updateMany({
        where: { id: { in: pinnedIdList } },
        data: { isPinned: 0 },
      });
    }

    if (existAddress.length > 0) {
      return await this.prismaService.address.update({
        where: { id: existAddress[0].id },
        data: {
          isPinned: 1,
          type: createAddressDto.type,
          latitude: createAddressDto.latitude,
          longitude: createAddressDto.longitude,
          range: createAddressDto.range,
        },
      });
    }

    return await this.prismaService.address.create({
      data: {
        userId,
        name: createAddressDto.name,
        latitude: createAddressDto.latitude,
        longitude: createAddressDto.longitude,
        range: createAddressDto.range,
        type: createAddressDto.type,
        isPinned: 1,
      },
    });
  }

  async findPinned(userId: number) {
    const address = await this.prismaService.address.findFirst({
      where: { userId, isPinned: 1 },
    });
    if (address) {
      return address;
    } else {
      return new NotFoundException();
    }
  }

  // async updatePinned(activePinnedId: number, inactivePinnedId: number) {
  //   if (inactivePinnedId !== 0) {
  //     await this.prismaService.address.update({
  //       where: { id: inactivePinnedId },
  //       data: { isPinned: 0 },
  //     });
  //   }
  //   return await this.prismaService.address.update({
  //     where: { id: activePinnedId },
  //     data: { isPinned: 1 },
  //   });
  // }

  async findAll(userId: number) {
    return await this.prismaService.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(addressId: number) {
    return await this.prismaService.address.delete({
      where: { id: addressId },
    });
  }
}
