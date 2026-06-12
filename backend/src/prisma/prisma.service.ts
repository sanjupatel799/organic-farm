import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client: any;

  async onModuleInit() {
    const { PrismaClient } = require(join(process.cwd(), 'generated/prisma/client.js'));
    this._client = new PrismaClient();
    await this._client.$connect();
  }

  async onModuleDestroy() {
    if (this._client) {
      await this._client.$disconnect();
    }
  }

  async $transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    return this._client?.$transaction(fn) ?? Promise.reject(new Error('Prisma not initialized'));
  }

  get user() { return this._client?.user; }
  get address() { return this._client?.address; }
  get category() { return this._client?.category; }
  get product() { return this._client?.product; }
  get productImage() { return this._client?.productImage; }
  get cart() { return this._client?.cart; }
  get cartItem() { return this._client?.cartItem; }
  get order() { return this._client?.order; }
  get orderItem() { return this._client?.orderItem; }
  get payment() { return this._client?.payment; }
  get coupon() { return this._client?.coupon; }
  get couponUsage() { return this._client?.couponUsage; }
  get wishlist() { return this._client?.wishlist; }
  get blog() { return this._client?.blog; }
  get contact() { return this._client?.contact; }
  get review() { return this._client?.review; }
}
