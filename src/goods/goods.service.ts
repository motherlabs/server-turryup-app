import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DefaultState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateGoodsDto } from './dto/createGoods.dto';
import { UpdateGoodsDto } from './dto/updateGoods.dto';

@Injectable()
export class GoodsService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async findAllByUserLocationRange(
    userLatitude: number,
    userLongitude: number,
    userSelectedRange: number,
    skip: number,
    take: number,
    category: string,
  ) {
    const plusLatitudeByyRange =
      //eslint-disable-next-line
      userLatitude + userSelectedRange / 109.958489129649955;
    const minusLatitudeByRange =
      //eslint-disable-next-line
      userLatitude - userSelectedRange / 109.958489129649955;
    const plusLongitudeByRange = userLongitude + userSelectedRange / 88.74;
    const minusLongitudeByRange = userLongitude - userSelectedRange / 88.74;
    if (category === '') {
      const goodsList = await this.prismaService.goods.findMany({
        take,
        skip,
        include: { store: true, GoodsImage: true, category: true },
        where: {
          state: DefaultState.NORMAL,
          store: {
            latitude: { gt: minusLatitudeByRange, lt: plusLatitudeByyRange },
            longitude: { gt: minusLongitudeByRange, lt: plusLongitudeByRange },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return goodsList;
    } else {
      const goodsList = await this.prismaService.goods.findMany({
        take,
        skip,
        include: { store: true, GoodsImage: true, category: true },
        where: {
          state: DefaultState.NORMAL,
          store: {
            latitude: { gt: minusLatitudeByRange, lt: plusLatitudeByyRange },
            longitude: { gt: minusLongitudeByRange, lt: plusLongitudeByRange },
          },
          category: { name: category },
        },
        orderBy: { createdAt: 'desc' },
      });
      return goodsList;
    }
    // const filteredStoreList = goodsList.filter(
    //   (v) =>
    //     v.store.latitude < plusLatitudeByyRange &&
    //     v.store.latitude > minusLatitudeByRange &&
    //     v.store.longitude < plusLongitudeByRange &&
    //     v.store.longitude > minusLongitudeByRange,
    // );
  }

  async findAll(storeId: number) {
    return await this.prismaService.goods.findMany({
      where: { AND: [{ state: DefaultState.NORMAL }, { storeId }] },
      include: { GoodsImage: true },
    });
  }

  async findOne(goodsId: number) {
    const goods = await this.prismaService.goods.findUnique({
      where: { id: goodsId },
      include: {
        GoodsImage: true,
        category: true,
        store: { include: { Goods: { include: { GoodsImage: true } } } },
      },
    });
    if (goods) {
      if (goods.state === DefaultState.NORMAL) {
        return goods;
      } else {
        return new NotFoundException();
      }
    } else {
      return new NotFoundException();
    }
  }

  async create(
    createGoodsDto: CreateGoodsDto,
    image: Array<Express.Multer.File>,
  ) {
    const {
      categoryId,
      discount,
      expiryDate,
      name,
      originPrice,
      quantity,
      salePrice,
      storeId,
      isAutoDiscount,
    } = createGoodsDto;

    const createdGoods = await this.prismaService.goods.create({
      data: {
        categoryId: parseInt(categoryId),
        storeId: parseInt(storeId),
        discount: parseInt(discount),
        originPrice: parseInt(originPrice),
        quantity: parseInt(quantity),
        salePrice: parseInt(salePrice),
        expiryDate: new Date(expiryDate),
        isAutoDiscount: parseInt(isAutoDiscount),
        name,
      },
    });

    if (createdGoods) {
      const imageList: {
        goodsId: number;
        location: string;
      }[] = [];

      const imageLocation = await this.uploadService.uploadImage(
        'goods',
        image,
      );
      imageLocation.map((v) => {
        imageList.push({
          goodsId: createdGoods.id,
          location: v,
        });
      });
      const createdGoodsImages = await this.prismaService.goodsImage.createMany(
        { data: imageList },
      );

      return {
        createdGoods,
        createdGoodsImages,
      };
    }

    return new InternalServerErrorException();
  }

  async update(
    goodId: number,
    updateGoodsDto: UpdateGoodsDto,
    image: Array<Express.Multer.File>,
  ) {
    const {
      discount,
      expiryDate,
      name,
      originPrice,
      quantity,
      salePrice,
      isAutoDiscount,
      categoryId,
      deleteImageIdList,
      deleteImageLocationList,
    } = updateGoodsDto;

    const updatedGoods = await this.prismaService.goods.update({
      where: { id: goodId },
      data: {
        categoryId: parseInt(categoryId),
        discount: parseInt(discount),
        originPrice: parseInt(originPrice),
        quantity: parseInt(quantity),
        salePrice: parseInt(salePrice),
        isAutoDiscount: parseInt(isAutoDiscount),
        expiryDate: new Date(expiryDate),
        name,
      },
    });

    const data = [];
    if (updatedGoods) {
      data.push(updatedGoods);
      if (image.length > 0) {
        const imageList: {
          goodsId: number;
          location: string;
        }[] = [];

        const imageLocation = await this.uploadService.uploadImage(
          'goods',
          image,
        );
        imageLocation.map((v) => {
          imageList.push({
            goodsId: updatedGoods.id,
            location: v,
          });
        });
        const createdGoodsImages =
          await this.prismaService.goodsImage.createMany({ data: imageList });

        data.push(createdGoodsImages);
      }
      if (deleteImageIdList.length > 0) {
        const imageIdList = deleteImageIdList.split(',');
        const imageIdListTypeCast: number[] = [];
        imageIdList.map((v) => {
          imageIdListTypeCast.push(parseInt(v));
        });
        const imageLocationArray = deleteImageLocationList.split(',');
        await this.uploadService.deleteImage(imageLocationArray);
        await this.prismaService.goodsImage.deleteMany({
          where: { id: { in: imageIdListTypeCast } },
        });
      }
      return data;
    } else {
      return new InternalServerErrorException();
    }
  }
  async updateQuantity(goodsId: number, quantity: number) {
    return await this.prismaService.goods.update({
      where: { id: goodsId },
      data: { quantity },
    });
  }
}
