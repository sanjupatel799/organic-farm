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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('addresses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getAddresses(@CurrentUser('id') userId: number) {
    return this.usersService.getAddresses(userId);
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createAddress(
    @CurrentUser('id') userId: number,
    @Body() data: { name: string; phone: string; address: string; city: string; state: string; pincode: string; isDefault?: boolean },
  ) {
    return this.usersService.createAddress(userId, data);
  }

  @Patch('addresses/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateAddress(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.usersService.updateAddress(userId, id, data);
  }

  @Delete('addresses/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteAddress(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.deleteAddress(userId, id);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getOrderHistory(@CurrentUser('id') userId: number) {
    return this.usersService.getOrderHistory(userId);
  }
}
