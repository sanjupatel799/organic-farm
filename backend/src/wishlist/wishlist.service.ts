import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: number) {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return items;
  }

  async addItem(userId: number, productId: number) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) throw new ConflictException('Product already in wishlist');

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.wishlist.create({
      data: { userId, productId },
      include: { product: { include: { images: true } } },
    });
  }

  async removeItem(userId: number, productId: number) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');

    await this.prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { message: 'Removed from wishlist' };
  }

  async isInWishlist(userId: number, productId: number) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!item;
  }
}
