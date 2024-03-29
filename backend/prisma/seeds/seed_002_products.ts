import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductData {
  name: string;
  category: string;
  categoryId?: string;
}

const pictureUrl = 'https://dummyimage.com/3200x3200/333/aaa';

const products: ProductData[] = [
  { name: 'Laptop X', category: 'Electronics' },
  { name: 'Ultrawide Curved Monitor', category: 'Electronics' },
  { name: 'Mechanical Gaming Keyboard', category: 'Electronics' },
  { name: 'Noise-Cancelling Headphones', category: 'Electronics' },
  { name: 'High-End Smartphone', category: 'Phones & Tablets' },
  { name: 'Instant Print Camera', category: 'Cameras & Photography' },
  { name: 'Compact Mirrorless Camera', category: 'Cameras & Photography' },
  { name: 'Travel Drone with 4K Camera', category: 'Cameras & Photography' },
  { name: 'Designer Dress', category: "Women's Clothing" },
  { name: 'Casual Button-Down Shirt', category: "Men's Clothing" },
  { name: 'Skinny Jeans', category: "Men's Clothing" },
  { name: 'Luxury Watch', category: 'Accessories' },
  { name: 'Leather Laptop Bag', category: 'Bags & Wallets' },
  { name: 'Smart Home Speaker', category: 'Home Entertainment' },
  { name: 'Ultra HD Smart TV', category: 'Home Entertainment' },
  { name: 'Wireless Projector', category: 'Home Entertainment' },
  { name: 'Coffee Maker with Grinder', category: 'Appliances' },
  { name: 'Stainless Steel Blender', category: 'Appliances' },
  { name: 'Memory Foam Mattress', category: 'Home & Garden' },
  { name: 'Luxury Showerhead', category: 'Home & Garden' },
  { name: 'Designer Area Rug', category: 'Home Decor' },
  { name: 'Modern Wall Art Set', category: 'Home Decor' },
  { name: 'Gaming Desktop PC', category: 'Electronics' },
  { name: '2-in-1 Chromebook Tablet', category: 'Electronics' },
  { name: 'Laser Printer with Scanner', category: 'Electronics' },
  { name: 'Wireless Earbuds', category: 'Electronics' },
  { name: 'Tablet Stand Case', category: 'Tablet Accessories' },
  { name: 'Fitness Tracker Watch', category: 'Smartwatches' },
  { name: 'Noise-Cancelling Travel Headphones', category: 'Electronics' },
  { name: 'Action Camera Mount', category: 'Camera Accessories' },
  { name: 'High-Zoom Telephoto Lens', category: 'Lenses' },
  { name: 'Stylish Backpack Purse', category: 'Bags & Wallets' },
  { name: 'Woolen Beanie Hat', category: 'Hats & Scarves' },
  { name: 'Aviator Sunglasses', category: 'Sunglasses & Eyewear' },
  { name: 'Modern Sofa Set', category: 'Living Room Furniture' },
  { name: 'Plush King-Size Bed', category: 'Bedroom Furniture' },
  { name: 'Stainless Steel Fridge', category: 'Appliances' },
  { name: 'Expandable Dining Table', category: 'Dining Room Furniture' },
  { name: 'Ergonomic Office Chair', category: 'Office Furniture' },
  { name: 'Abstract Canvas Wall Art', category: 'Home Decor' },
  { name: 'Plush Bath Towels', category: 'Bath Towels' },
  { name: 'Ceramic Dinnerware Set', category: 'Tabletop Decor' },
  { name: 'Watering Can Set', category: 'Garden Supplies' },
  { name: 'Heavy-Duty Power Tools Kit', category: 'Tools & Equipment' },
  { name: 'Indoor Herb Garden Kit', category: 'Plants & Flowers' },
  { name: 'Folding Patio Furniture Set', category: 'Outdoor Furniture' },
  { name: 'Charcoal Barbecue Grill', category: 'Grills & Smokers' },
  { name: 'Inflatable Pool Lounge', category: 'Pool & Spa Supplies' },
  { name: 'Leather Soccer Ball', category: 'Team Sports Equipment' },
  { name: 'Yoga Mat and Accessories', category: 'Fitness Equipment' },
  { name: 'Camping Tent for 4 People', category: 'Camping Gear' },
  { name: 'Lightweight Hiking Boots', category: 'Hiking & Backpacking Gear' },
  { name: 'Durable Climbing Harness', category: 'Climbing Gear' },
  { name: 'Insulated Ski Jacket', category: 'Skiing & Snowboarding Gear' },
  { name: 'Inflatable Stand-Up Paddleboard', category: 'Water Sports Gear' },
  { name: 'Performance Running Shoes', category: 'Activewear & Apparel' },
  { name: 'Wireless Activity Tracker', category: 'Fitness Equipment' },
  { name: "Children's Bike with Training Wheels", category: "Kids' Clothing" },
  { name: 'Cozy Fleece Pajamas', category: 'Sleepwear' },
  { name: 'Sterling Silver Necklace', category: 'Jewelry' },
  { name: 'Leather Phone Case', category: 'Cell Phone Accessories' },
  { name: 'Wireless Charging Stand', category: 'Wireless Headphones' },
];

async function getCategoriesDictionary(): Promise<{ [key: string]: number }> {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const categoryDictionary = categories.reduce(
    (acc: { [key: string]: number }, category) => {
      acc[category.name] = category.id;
      return acc;
    },
    {}
  );

  return categoryDictionary;
}

async function main() {
  const categoriesDict = await getCategoriesDictionary();

  let data: any = [];

  products.forEach((product) => {
    const categoryId = categoriesDict[product.category];
    if (categoryId) {
      data.push({ name: product.name, picture: pictureUrl, categoryId });
    }
  });

  await prisma.product.createMany({ data, skipDuplicates: true });

  console.log('Products seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
