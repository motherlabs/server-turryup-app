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
  ) {
    const goodsList = await this.prismaService.goods.findMany({
      include: { store: true, GoodsImage: true, category: true },
      where: { state: DefaultState.NORMAL },
    });
    if (goodsList.length > 0) {
      const plusLatitudeByyRange =
        //eslint-disable-next-line
        userLatitude + userSelectedRange / 109.958489129649955;
      const minusLatitudeByRange =
        //eslint-disable-next-line
        userLatitude - userSelectedRange / 109.958489129649955;
      const plusLongitudeByRange = userLongitude + userSelectedRange / 88.74;
      const minusLongitudeByRange = userLongitude - userSelectedRange / 88.74;

      const filteredStoreList = goodsList.filter(
        (v) =>
          v.store.latitude < plusLatitudeByyRange &&
          v.store.latitude > minusLatitudeByRange &&
          v.store.longitude < plusLongitudeByRange &&
          v.store.longitude > minusLongitudeByRange,
      );

      return filteredStoreList;
    } else {
      return goodsList;
    }
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
    // image: Array<Express.Multer.File>,
  ) {
    const {
      discount,
      expiryDate,
      name,
      originPrice,
      quantity,
      salePrice,
      categoryId,
    } = updateGoodsDto;

    const updatedGoods = await this.prismaService.goods.update({
      where: { id: goodId },
      data: {
        categoryId: parseInt(categoryId),
        discount: parseInt(discount),
        originPrice: parseInt(originPrice),
        quantity: parseInt(quantity),
        salePrice: parseInt(salePrice),
        expiryDate: new Date(expiryDate),
        name,
      },
    });

    // const data = [];
    // if (updateGoods) {
    //   data.push(updatedGoods);
    //   if (image.length > 0) {
    //     const imageList: {
    //       goodsId: number;
    //       location: string;
    //     }[] = [];

    //     const imageLocation = await this.uploadService.uploadImage(
    //       'goods',
    //       image,
    //     );
    //     imageLocation.map((v) => {
    //       imageList.push({
    //         goodsId: updatedGoods.id,
    //         location: v,
    //       });
    //     });
    //     const createdGoodsImages =
    //       await this.prismaService.goodsImage.createMany({ data: imageList });

    //     data.push(createdGoodsImages);
    //   }
    //   if (deleteImageIdList.length > 0) {
    //     const imageIdList = deleteImageIdList.split(',');
    //     const imageIdListTypeCast: number[] = [];
    //     imageIdList.map((v) => {
    //       imageIdListTypeCast.push(parseInt(v));
    //     });
    //     const imageLocationList = deleteImageLocationList.split(',');
    //     await this.uploadService.deleteImage(imageLocationList);
    //     await this.prismaService.goodsImage.deleteMany({
    //       where: { id: { in: imageIdListTypeCast } },
    //     });
    //   }
    //   return data;
    // }
    if (updatedGoods) {
      return updatedGoods;
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
