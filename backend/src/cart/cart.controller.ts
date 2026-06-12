import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@CurrentUser('id') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  addItem(
    @CurrentUser('id') userId: number,
    @Body() body: { productId: number; quantity?: number },
  ) {
    return this.cartService.addItem(userId, body.productId, body.quantity);
  }

  @Patch('items/:id')
  updateItemQuantity(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, body.quantity);
  }

  @Delete('items/:id')
  removeItem(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  clearCart(@CurrentUser('id') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
