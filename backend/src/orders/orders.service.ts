import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: number, status?: string, page: number = 1, limit: number = 10) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          payments: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
        address: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(userId: number, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate address
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found');

    // Calculate totals
    const subtotal = cart.items.reduce((sum: number, item: any) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    let discount = 0;
    let couponId: number | null = null;

    // Apply coupon if provided
    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode },
      });
      if (!coupon || !coupon.isActive || new Date() > coupon.expiry) {
        throw new BadRequestException('Invalid or expired coupon');
      }
      if (subtotal < (coupon.minAmount || 0)) {
        throw new BadRequestException(`Minimum amount of $${coupon.minAmount} required for this coupon`);
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new BadRequestException('Coupon usage limit reached');
      }

      discount = coupon.discountType === 'PERCENTAGE'
        ? (subtotal * coupon.discount) / 100
        : coupon.discount;
      couponId = coupon.id;
    }

    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal - discount + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create order with items
    const order = await this.prisma.$transaction(async (tx: any) => {
      // Check stock
      for (const item of cart.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${item.product.name}`);
        }
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal,
          discount,
          shipping,
          total,
          couponId,
          addressId: dto.addressId,
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              productName: item.product.name,
              productImage: item.product.images[0]?.url || null,
              price: item.product.salePrice || item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true, address: true },
      });

      // Update stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Update coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: { couponId, userId, orderId: newOrder.id },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return this.findById(order.id);
  }

  async updateStatus(id: number, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true, payments: true, address: true },
    });
  }

  async getUserOrders(userId: number) {
    return this.findAll(userId);
  }

  async cancelOrder(userId: number, id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== userId) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new BadRequestException('Order cannot be cancelled');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { items: true, payments: true, address: true },
    });
  }
}
