import { Injectable, NotFoundException } from '@nestjs/common';
import { DefaultState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/createStore.dto';
import { UpdateStoreDto } from './dto/updateStore.dto';

@Injectable()
export class StoreService {
  constructor(private prismaService: PrismaService) {}

  async findAllByUserLocationRange(
    userLatitude: number,
    userLongitude: number,
  ) {
    const storeList = await this.prismaService.store.findMany({
      where: { state: DefaultState.NORMAL },
    });

    if (storeList.length > 0) {
      const plusLatitudeByyRange =
        //eslint-disable-next-line
        userLatitude + 3 / 109.958489129649955;
      const minusLatitudeByRange =
        //eslint-disable-next-line
        userLatitude - 3 / 109.958489129649955;
      const plusLongitudeByRange = userLongitude + 3 / 88.74;
      const minusLongitudeByRange = userLongitude - 3 / 88.74;

      const filteredStoreList = storeList.filter(
        (v) =>
          v.latitude < plusLatitudeByyRange &&
          v.latitude > minusLatitudeByRange &&
          v.longitude < plusLongitudeByRange &&
          v.longitude > minusLongitudeByRange,
      );

      return filteredStoreList;
    } else {
      return storeList;
    }
  }

  async findOne(userId: number) {
    const store = await this.prismaService.store.findUnique({
      where: { userId: userId },
      include: {
        Goods: {
          include: { GoodsImage: true, store: true },
          orderBy: { createdAt: 'desc' },
        },
        Order: {
          include: {
            goods: { include: { GoodsImage: true } },
            payment: { include: { user: true } },
          },
        },
      },
    });
    if (store) {
      if (store.state === DefaultState.NORMAL) {
        return store;
      } else {
        return new NotFoundException();
      }
    } else {
      return new NotFoundException();
    }
  }

  async create(createStoreDto: CreateStoreDto) {
    const {
      userId,
      businessHours,
      dayOff,
      detailAddress,
      latitude,
      longitude,
      name,
      storeNumber,
      picupZone,
      roadNameAddress,
    } = createStoreDto;
    return await this.prismaService.store.create({
      data: {
        userId,
        businessHours,
        dayOff,
        detailAddress,
        latitude,
        longitude,
        name,
        storeNumber,
        picupZone,
        roadNameAddress,
      },
    });
  }

  async update(updateStoreDto: UpdateStoreDto, userId: number) {
    return await this.prismaService.store.update({
      where: { userId },
      data: updateStoreDto,
    });
  }
}
