import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser('id') userId: number) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  addItem(
    @CurrentUser('id') userId: number,
    @Body() body: { productId: number },
  ) {
    return this.wishlistService.addItem(userId, body.productId);
  }

  @Delete(':productId')
  removeItem(
    @CurrentUser('id') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeItem(userId, productId);
  }

  @Get('check/:productId')
  checkItem(
    @CurrentUser('id') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.isInWishlist(userId, productId);
  }
}
