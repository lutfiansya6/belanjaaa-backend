// Prisma seed script
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { fakerID_ID as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Elektronik', icon: 'zap' },
  { name: 'Pakaian Pria', icon: 'shirt' },
  { name: 'Pakaian Wanita', icon: 'sparkles' },
  { name: 'Handphone & Aksesoris', icon: 'smartphone' },
  { name: 'Komputer & Laptop', icon: 'laptop' },
  { name: 'Perawatan & Kecantikan', icon: 'heart' },
  { name: 'Makanan & Minuman', icon: 'coffee' },
  { name: 'Otomotif', icon: 'car' },
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80',
];

async function main() {
  console.log('Clearing existing data...');
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.shop.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Seed 1 Admin
  console.log('Seeding 1 Admin...');
  await prisma.user.create({
    data: {
      email: 'admin@shopee.test',
      name: 'Admin Toko',
      password: defaultPassword,
      phone: '081234567890',
      role: Role.ADMIN,
    },
  });

  // 2. Seed 10 Pembeli (BUYER)
  console.log('Seeding 10 Buyers...');
  for (let i = 1; i <= 10; i++) {
    await prisma.user.create({
      data: {
        email: `buyer${i}@shopee.test`,
        name: faker.person.fullName(),
        password: defaultPassword,
        phone: faker.phone.number({ style: 'national' }),
        role: Role.BUYER,
      },
    });
  }

  // 3. Seed 5 Penjual (SELLER) beserta Toko
  console.log('Seeding 5 Sellers with Shops...');
  const createdShops = [];
  const shopNames = [
    'Berkah Jaya Official',
    'Mega Elektronik Nusantara',
    'Fashion Sejahtera Store',
    'Sentosa Gadget Center',
    'Dapur Mama Kreatif',
  ];

  for (let i = 1; i <= 5; i++) {
    const seller = await prisma.user.create({
      data: {
        email: `seller${i}@shopee.test`,
        name: faker.person.fullName(),
        password: defaultPassword,
        phone: faker.phone.number({ style: 'national' }),
        role: Role.SELLER,
        shop: {
          create: {
            name: shopNames[i - 1],
            description: `Toko resmi ${shopNames[i - 1]} terpercaya di Indonesia. Menjual produk berkualitas tinggi dengan jaminan garansi.`,
            city: faker.location.city(),
          },
        },
      },
      include: {
        shop: true,
      },
    });

    if (seller.shop) {
      createdShops.push(seller.shop);
    }
  }

  // 4. Seed 8 Kategori
  console.log('Seeding 8 Categories...');
  const createdCategories = [];
  for (const cat of CATEGORIES) {
    const category = await prisma.category.create({
      data: cat,
    });
    createdCategories.push(category);
  }

  // 5. Seed 100 Produk
  console.log('Seeding 100 Products...');
  const adjectives = [
    'Original',
    'Premium',
    'Eksklusif',
    'Terbaik',
    'Modern',
    'Multifungsi',
    'Elegan',
    'Terbaru 2026',
    'Tahan Lama',
    'Super Bass',
    'Katun Lembut',
  ];

  const productBases = [
    'Sepatu Sneakers Pria',
    'Headphone Wireless Bluetooth',
    'Kemeja Casual Katun Slim Fit',
    'Jam Tangan Pria Sporty',
    'Powerbank 20.000mAh Fast Charging',
    'Kaus Polos Premium Combed 30s',
    'Tas Ransel Laptop Waterproof',
    'Serum Wajah Glowing Vitamin C',
    'Kopi Bubuk Arabika Robusta Asli',
    'Holder HP Mobil Magnetik',
    'Keyboard Mekanikal RGB',
    'Mouse Wireless Ergonomis',
    'Jaket Hoodie Fleece Tebal',
    'Blouse Wanita Motif Bunga Cantik',
    'Kamera Dasbor Mobil FHD',
    'Snack Keripik Pedas Manis Gurih',
  ];

  for (let i = 1; i <= 100; i++) {
    const shop = createdShops[i % createdShops.length];
    const category = createdCategories[i % createdCategories.length];
    const baseName = productBases[i % productBases.length];
    const adj = adjectives[faker.number.int({ min: 0, max: adjectives.length - 1 })];
    const productName = `${baseName} ${adj} - Seri #${i}`;

    // Price between Rp 15.000 and Rp 2.500.000 (rounded to 1000)
    const rawPrice = faker.number.int({ min: 15, max: 2500 }) * 1000;
    const stock = faker.number.int({ min: 10, max: 250 });
    const sold = faker.number.int({ min: 0, max: 800 });
    const rating = parseFloat(faker.number.float({ min: 3.8, max: 5.0, fractionDigits: 1 }).toFixed(1));
    const imageUrl = SAMPLE_IMAGES[i % SAMPLE_IMAGES.length];

    await prisma.product.create({
      data: {
        name: productName,
        description: `Deskripsi lengkap untuk ${productName}. Produk berkualitas tinggi, pengiriman cepat, bergaransi resmi, dan jaminan kepuasan pelanggan 100%. Cocok untuk penggunaan sehari-hari.`,
        price: rawPrice,
        stock,
        imageUrl,
        sold,
        rating,
        shopId: shop.id,
        categoryId: category.id,
      },
    });
  }

  console.log('✅ Seed completed successfully:');
  console.log('- 1 Admin: admin@shopee.test');
  console.log('- 10 Buyers: buyer1@shopee.test .. buyer10@shopee.test');
  console.log('- 5 Sellers with Shops: seller1@shopee.test .. seller5@shopee.test');
  console.log('- 8 Categories');
  console.log('- 100 Products');
  console.log('Default password for all accounts: password123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

