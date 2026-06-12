import {
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadFile(
    @UploadedFile() file: any,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.cloudinaryService.isConfigured()) {
      const placeholderUrl = `/images/general/hero-farm.svg`;
      return { url: placeholderUrl, secureUrl: placeholderUrl };
    }

    const result = await this.cloudinaryService.uploadFile(file.buffer, {
      folder: folder || 'organic-farm/products',
    });
    return result;
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5, { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadMultiple(
    @UploadedFiles() files: any[],
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (!this.cloudinaryService.isConfigured()) {
      return files.map((f) => ({
        url: `/images/general/hero-farm.svg`,
        secureUrl: `/images/general/hero-farm.svg`,
      }));
    }

    const buffers = files.map((f: any) => f.buffer);
    return this.cloudinaryService.uploadFiles(
      buffers,
      folder || 'organic-farm/products',
    );
  }

  @Get('signature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  getSignature(
    @Query('folder') folder?: string,
  ) {
    const defaultParams = {
      folder: folder || 'organic-farm/products',
    };
    const signature = this.cloudinaryService.generateSignature(defaultParams);
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      ...signature,
      ...defaultParams,
    };
  }
}
