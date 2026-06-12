import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, search, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (category) where.category = { slug: category };
    if (search) where.name = { contains: search };
    if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice };
    if (rating !== undefined) where.rating = { gte: rating };

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { images: true, category: true, reviews: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findRelated(productId: number, categoryId: number) {
    return this.prisma.product.findMany({
      where: { categoryId, id: { not: productId } },
      take: 4,
      include: { images: true, category: true },
    });
  }

  async create(dto: CreateProductDto) {
    const { images, ...productData } = dto;
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        images: images?.length
          ? { create: images.map((url) => ({ url, alt: dto.name })) }
          : undefined,
      },
      include: { images: true, category: true },
    });
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const { images, ...productData } = dto;
    if (images) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
    }
    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: images?.length
          ? { create: images.map((url) => ({ url, alt: productData.name || existing.name })) }
          : undefined,
      },
      include: { images: true, category: true },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  async getBestSellers() {
    return this.prisma.product.findMany({
      take: 8,
      orderBy: { rating: 'desc' },
      include: { images: true, category: true },
    });
  }

  async getFeatured() {
    return this.prisma.product.findMany({
      where: { salePrice: { not: null } },
      take: 8,
      include: { images: true, category: true },
    });
  }
}
