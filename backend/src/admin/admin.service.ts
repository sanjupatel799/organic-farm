import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { total: true }, where: { status: 'DELIVERED' } }),
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } }, items: true },
      }),
      this.prisma.product.findMany({ where: { stock: { lte: 10 } }, take: 5 }),
    ]);

    const monthlyRevenue = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: thisMonth }, status: 'DELIVERED' },
    });

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      recentOrders,
      lowStockProducts,
    };
  }

  async getInventoryAlerts() {
    const outOfStock = await this.prisma.product.count({ where: { stock: 0 } });
    const lowStock = await this.prisma.product.count({ where: { stock: { gt: 0, lte: 10 } } });
    return { outOfStock, lowStock };
  }
}
