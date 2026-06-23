import "dotenv/config";
import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();

  console.log("🌱 Seeding database...");

  // Clean existing data (child tables first to avoid FK violations)
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ──────────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@organicfarm.com",
      password: hashedPassword,
      phone: "+1-555-000-0001",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@example.com",
      password: hashedPassword,
      phone: "+1-555-000-0002",
      role: "USER",
    },
  });

  console.log("  ✅ Users created");

  // ─── Categories ─────────────────────────────
  const catData = [
    { name: "Millets", slug: "millets", description: "Nutritious ancient grains packed with fiber and protein" },
    { name: "Honey", slug: "honey", description: "Pure raw honey straight from the hive" },
    { name: "Spices", slug: "spices", description: "Aromatic organic spices for flavorful cooking" },
    { name: "Rice", slug: "rice", description: "Premium quality organic rice varieties" },
    { name: "Dry Fruits", slug: "dry-fruits", description: "Naturally dried fruits full of nutrients" },
    { name: "Oils", slug: "oils", description: "Cold-pressed organic cooking oils" },
    { name: "Vegetables", slug: "vegetables", description: "Fresh organic farm vegetables" },
  ];

  const categories = await Promise.all(
    catData.map((c: any) => prisma.category.create({ data: c }))
  );

  console.log("  ✅ Categories created");

  // ─── Products ───────────────────────────────
  const productsData = [
    { name: "Organic Turmeric Powder", slug: "organic-turmeric-powder", desc: "Premium quality turmeric powder. Rich in curcumin with vibrant golden color.", benefits: "Anti-inflammatory, antioxidants, joint health, immunity", price: 12.99, sale: 9.99, stock: 150, rating: 4.8, cat: 2 },
    { name: "Pure Raw Honey", slug: "pure-raw-honey", desc: "Unprocessed raw honey harvested from wild forest hives.", benefits: "Energy booster, antibacterial, soothes throat", price: 24.99, sale: 19.99, stock: 200, rating: 4.9, cat: 1 },
    { name: "Foxtail Millets", slug: "foxtail-millets", desc: "Premium foxtail millets. Lightweight and easy to digest.", benefits: "Gluten-free, low GI, rich in fiber", price: 8.99, sale: 6.99, stock: 300, rating: 4.6, cat: 0 },
    { name: "Cold Pressed Coconut Oil", slug: "cold-pressed-coconut-oil", desc: "Virgin coconut oil. Cold-pressed retaining all nutrients.", benefits: "Heart-healthy, boosts metabolism, skin/hair health", price: 15.99, sale: null, stock: 180, rating: 4.7, cat: 5 },
    { name: "Organic Basmati Rice", slug: "organic-basmati-rice", desc: "Long-grain aromatic basmati. Chemical-free.", benefits: "Fiber-rich, low GI, aromatic flavor", price: 18.99, sale: 14.99, stock: 250, rating: 4.8, cat: 3 },
    { name: "Organic Almonds", slug: "organic-almonds", desc: "California-grown organic almonds.", benefits: "Brain health, healthy fats, vitamin E", price: 14.99, sale: 11.99, stock: 200, rating: 4.7, cat: 4 },
    { name: "Cold Pressed Mustard Oil", slug: "cold-pressed-mustard-oil", desc: "Traditional cold-pressed mustard oil.", benefits: "Heart-healthy, anti-inflammatory, omega-3", price: 11.99, sale: null, stock: 160, rating: 4.6, cat: 5 },
    { name: "Organic Black Pepper", slug: "organic-black-pepper", desc: "Whole organic black peppercorns.", benefits: "Digestion, antioxidants, anti-inflammatory", price: 9.99, sale: 7.49, stock: 220, rating: 4.5, cat: 2 },
    { name: "Organic Honey With Comb", slug: "organic-honey-with-comb", desc: "Pure honey with natural honeycomb pieces.", benefits: "Allergy relief, propolis, raw enzymes", price: 34.99, sale: 29.99, stock: 80, rating: 4.9, cat: 1 },
    { name: "Pearl Millets (Bajra)", slug: "pearl-millets-bajra", desc: "Traditional pearl millets. Rich in iron and calcium.", benefits: "Iron-rich, calcium source, gluten-free", price: 7.99, sale: 5.99, stock: 280, rating: 4.5, cat: 0 },
    { name: "Organic Dry Dates", slug: "organic-dry-dates", desc: "Sun-dried organic dates. No added sugar.", benefits: "Natural sweetener, fiber-rich, energy boost", price: 12.99, sale: null, stock: 190, rating: 4.6, cat: 4 },
    { name: "Fresh Organic Spinach", slug: "fresh-organic-spinach", desc: "Farm-fresh organic spinach.", benefits: "Iron-rich, vitamin K, antioxidants", price: 4.99, sale: 3.99, stock: 100, rating: 4.4, cat: 6 },
  ];

  const products = await Promise.all(
    productsData.map((p: any) =>
      prisma.product.create({
        data: {
          name: p.name, slug: p.slug, description: p.desc, benefits: p.benefits,
          price: p.price, salePrice: p.sale, stock: p.stock, rating: p.rating,
          categoryId: categories[p.cat].id,
          images: {
            create: [
              { url: `/images/products/${p.slug}.jpg`, alt: p.name },
              { url: `/images/products/${p.slug}-2.jpg`, alt: `${p.name} - alternate` },
            ],
          },
        },
      })
    )
  );

  // ─── Reviews ───────────────────────────────
  const customer = await prisma.user.findUnique({ where: { email: "priya@example.com" } });
  if (customer) {
    await prisma.review.create({ data: { productId: products[0].id, userId: customer.id, rating: 5, comment: "Best turmeric powder! Great color and aroma." } });
    await prisma.review.create({ data: { productId: products[1].id, userId: customer.id, rating: 5, comment: "Pure natural honey. Tastes like from the farm." } });
    await prisma.review.create({ data: { productId: products[3].id, userId: customer.id, rating: 4, comment: "Good quality coconut oil for cooking." } });
    await prisma.review.create({ data: { productId: products[4].id, userId: customer.id, rating: 5, comment: "Aromatic basmati rice. Perfect for biryani!" } });
  }

  console.log("  ✅ Reviews created");

  // ─── Blogs ─────────────────────────────────
  await prisma.blog.create({ data: { title: "10 Health Benefits of Organic Turmeric", slug: "benefits-of-organic-turmeric", content: "Turmeric has been used for thousands of years in Ayurvedic medicine. Its active compound curcumin offers powerful anti-inflammatory and antioxidant benefits. Regular consumption may help with joint pain, digestion, and immunity.\n\nHere are 10 proven benefits of adding organic turmeric to your daily diet...", excerpt: "Discover why golden milk has become a staple in wellness routines.", author: "Dr. Sarah Green", image: "/images/blogs/benefits-of-organic-turmeric.svg", published: true } });
  await prisma.blog.create({ data: { title: "The Complete Guide to Millets", slug: "complete-guide-to-millets", content: "Millets are ancient grains cultivated for thousands of years. They are naturally gluten-free, low in glycemic index, and rich in fiber, protein, and minerals like iron and calcium.\n\nIn this guide, we explore different types of millets and how to incorporate them into your meals...", excerpt: "Everything about cooking with these nutritious ancient grains.", author: "Priya Sharma", image: "/images/blogs/complete-guide-to-millets.svg", published: true } });
  await prisma.blog.create({ data: { title: "Why Organic Farming Matters", slug: "why-organic-farming-matters", content: "Organic farming is more than just avoiding pesticides. It's about building healthy soil, protecting biodiversity, and producing food that's better for you and the planet.\n\nLearn about the environmental and health benefits of choosing organic...", excerpt: "How choosing organic helps protect our planet.", author: "James Wilson", image: "/images/blogs/why-organic-farming-matters.svg", published: true } });

  console.log("  ✅ Blogs created");

  // ─── Coupons ───────────────────────────────
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  await prisma.coupon.create({ data: { code: "WELCOME10", discount: 10, discountType: "PERCENTAGE", expiry: expiryDate, minAmount: 25, maxUses: 1000, isActive: true } });

  const expDate2 = new Date();
  expDate2.setMonth(expDate2.getMonth() + 6);
  await prisma.coupon.create({ data: { code: "FREESHIP", discount: 5, discountType: "FIXED", expiry: expDate2, minAmount: 50, maxUses: 500, isActive: true } });

  console.log("  ✅ Coupons created");

  // ─── Address ──────────────────────────────
  if (customer) {
    await prisma.address.create({
      data: {
        userId: customer.id, name: "Priya Sharma", phone: "+1-555-000-0002",
        address: "42 Green Valley Apartments, Organic Lane", city: "Mumbai",
        state: "Maharashtra", pincode: "400001", isDefault: true,
      },
    });
  }

  console.log("  ✅ Address created");

  await prisma.$disconnect();
  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin: admin@organicfarm.com / password123");
  console.log("   User:  priya@example.com / password123");
  console.log("\n🏷️  Coupon Codes:");
  console.log("   WELCOME10 - 10% off (min $25)");
  console.log("   FREESHIP - $5 off (min $50)");
}

main().catch((e: any) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
