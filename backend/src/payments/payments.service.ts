import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(orderId: number, method: string, amount: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.payment.create({
      data: {
        orderId,
        method: method as any,
        amount,
        status: 'PENDING',
      },
    });
  }

  async updatePaymentStatus(paymentId: number, status: string, transactionId?: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');

    const data: any = { status: status as any };
    if (transactionId) data.transactionId = transactionId;

    return this.prisma.payment.update({
      where: { id: paymentId },
      data,
    });
  }

  async getPaymentByOrder(orderId: number) {
    return this.prisma.payment.findFirst({
      where: { orderId },
    });
  }

  // Razorpay order creation (placeholder - actual integration requires API keys)
  async createRazorpayOrder(amount: number, currency: string = 'INR') {
    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || '',
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
      });

      return order;
    } catch (error) {
      // Fallback for when Razorpay is not configured
      return {
        id: `order_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        status: 'created',
      };
    }
  }

  async verifyRazorpayPayment(
    orderId: string,
    paymentId: string,
    signature: string,
  ) {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return expectedSignature === signature;
    } catch {
      return false;
    }
  }
}
