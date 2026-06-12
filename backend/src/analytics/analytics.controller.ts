import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('monthly-sales')
  getMonthlySales(@Query('year') year?: string) {
    return this.analyticsService.getMonthlySales(year ? +year : undefined);
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit?: string) {
    return this.analyticsService.getTopProducts(limit ? +limit : 10);
  }

  @Get('revenue')
  getRevenueByPeriod(@Query('period') period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    return this.analyticsService.getRevenueByPeriod(period || 'monthly');
  }
}
