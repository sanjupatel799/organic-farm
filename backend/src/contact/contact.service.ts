import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.contact.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.count(),
    ]);
    return { messages, total, page, totalPages: Math.ceil(total / limit) };
  }

  async create(data: { name: string; email: string; message: string }) {
    return this.prisma.contact.create({ data });
  }

  async markAsRead(id: number) {
    const message = await this.prisma.contact.findUnique({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');
    return this.prisma.contact.update({
      where: { id },
      data: { read: true },
    });
  }

  async remove(id: number) {
    const message = await this.prisma.contact.findUnique({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Message deleted successfully' };
  }
}
