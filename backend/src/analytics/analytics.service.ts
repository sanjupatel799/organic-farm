import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      monthlyRevenue,
      lastMonthRevenue,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { total: true }, where: { status: 'DELIVERED' } }),
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: thisMonth }, status: 'DELIVERED' },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: lastMonth, lt: thisMonth }, status: 'DELIVERED' },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } }, items: true },
      }),
      this.prisma.product.findMany({ where: { stock: { lte: 10 } }, take: 10 }),
    ]);

    const revenueGrowth = lastMonthRevenue._sum.total
      ? (((monthlyRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / lastMonthRevenue._sum.total) * 100
      : 0;

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      recentOrders,
      lowStockProducts,
    };
  }

  async getMonthlySales(year?: number) {
    const currentYear = year || new Date().getFullYear();
    const sales = [];

    for (let month = 0; month < 12; month++) {
      const start = new Date(currentYear, month, 1);
      const end = new Date(currentYear, month + 1, 1);

      const result = await this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: start, lt: end },
          status: 'DELIVERED',
        },
      });

      sales.push({
        month: start.toLocaleString('default', { month: 'short' }),
        revenue: result._sum.total || 0,
        orders: await this.prisma.order.count({
          where: { createdAt: { gte: start, lt: end } },
        }),
      });
    }

    return sales;
  }

  async getTopProducts(limit: number = 10) {
    const products = await this.prisma.product.findMany({
      take: limit,
      orderBy: { rating: 'desc' },
      include: {
        images: true,
        _count: { select: { orderItems: true } },
      },
    });

    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      rating: p.rating,
      stock: p.stock,
      totalSold: p._count.orderItems,
      images: p.images,
    }));
  }

  async getRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const now = new Date();
    let start: Date;

    switch (period) {
      case 'daily':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        break;
      case 'weekly':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
        break;
      case 'monthly':
        start = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      case 'yearly':
        start = new Date(now.getFullYear() - 5, 0, 1);
        break;
    }

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start },
        status: 'DELIVERED',
      },
      orderBy: { createdAt: 'asc' },
    });

    return orders.map((o: any) => ({
      date: o.createdAt.toISOString().split('T')[0],
      revenue: o.total,
      orderNumber: o.orderNumber,
    }));
  }
}
