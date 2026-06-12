import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    });
  }

  /**
   * Upload a file buffer to Cloudinary
   */
  async uploadFile(
    fileBuffer: Buffer,
    options?: { folder?: string; publicId?: string },
  ): Promise<{ url: string; publicId: string; secureUrl: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || 'organic-farm/products',
          public_id: options?.publicId,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed - no result'));
          resolve({
            url: result.url,
            publicId: result.public_id,
            secureUrl: result.secure_url,
          });
        },
      );

      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: Buffer[],
    folder?: string,
  ): Promise<Array<{ url: string; publicId: string; secureUrl: string }>> {
    return Promise.all(
      files.map((file) => this.uploadFile(file, { folder })),
    );
  }

  /**
   * Delete an image by publicId
   */
  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  /**
   * Generate a signature for client-side unsigned uploads
   */
  generateSignature(
    params: Record<string, any>,
  ): { signature: string; timestamp: number } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureParams = { ...params, timestamp };
    const signature = cloudinary.utils.api_sign_request(
      signatureParams,
      process.env.CLOUDINARY_API_SECRET || '',
    );
    return { signature, timestamp };
  }

  /**
   * Check if Cloudinary is configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }
}
