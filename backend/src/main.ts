import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://organic-farm.vercel.app',
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
  });

  // Health check at root
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.json({
      status: 'ok',
      message: 'Organic Farm API',
      version: '1.0.0',
      docs: '/api/docs',
      endpoints: {
        auth: '/api/auth',
        products: '/api/products',
        categories: '/api/categories',
        cart: '/api/cart',
        orders: '/api/orders',
        payments: '/api/payments',
        coupons: '/api/coupons',
        users: '/api/users',
        wishlist: '/api/wishlist',
        blogs: '/api/blogs',
        contact: '/api/contact',
        admin: '/api/admin',
        analytics: '/api/analytics',
      },
    });
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Organic Farm API')
    .setDescription('API for the organic food e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
  console.log('\n========================================');
  console.log('  🚀 Organic Farm API - Running!');
  console.log('========================================');
  console.log(`  API Server:  http://localhost:${process.env.PORT ?? 4000}`);
  console.log(`  API Docs:    http://localhost:${process.env.PORT ?? 4000}/api/docs`);
  console.log(`  Frontend:    http://localhost:3000`);
  console.log('========================================\n');
}
bootstrap();
