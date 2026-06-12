import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createRazorpayOrder(@Body() body: { amount: number; currency?: string }) {
    return this.paymentsService.createRazorpayOrder(body.amount, body.currency);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  verifyPayment(@Body() body: { orderId: string; paymentId: string; signature: string }) {
    return this.paymentsService.verifyRazorpayPayment(
      body.orderId,
      body.paymentId,
      body.signature,
    );
  }
}
