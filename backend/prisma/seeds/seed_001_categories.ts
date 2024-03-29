import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Hierarchy {
  name: string;
  // id?: number;
  children?: Hierarchy[];
}

const categoryData: Hierarchy[] = [
  {
    name: 'Electronics',
    children: [
      {
        name: 'Computers & Laptops',
        children: [
          { name: 'Desktops' },
          { name: 'Laptops' },
          { name: 'Gaming PCs' },
          { name: 'Chromebooks' },
          { name: '2-in-1 Laptops' },
          { name: 'Computer Components' },
          { name: 'Monitors' },
          { name: 'Printers & Scanners' },
        ],
      },
      {
        name: 'Phones & Tablets',
        children: [
          { name: 'Smartphones' },
          { name: 'Tablets' },
          { name: 'Cell Phone Accessories' },
          { name: 'Tablet Accessories' },
          { name: 'Smartwatches' },
          { name: 'Wireless Headphones' },
        ],
      },
      {
        name: 'Home Entertainment',
        children: [
          { name: 'Televisions' },
          { name: 'Audio Systems' },
          { name: 'Projectors & Screens' },
          { name: 'Streaming Devices' },
          { name: 'Gaming Consoles' },
        ],
      },
      { name: 'Appliances' },
      {
        name: 'Cameras & Photography',
        children: [
          { name: 'DSLR Cameras' },
          { name: 'Mirrorless Cameras' },
          { name: 'Compact Cameras' },
          { name: 'Action Cameras' },
          { name: 'Drones' },
          { name: 'Lenses' },
          { name: 'Tripods & Camera Bags' },
        ],
      },
    ],
  },
  {
    name: 'Clothing & Accessories',
    children: [
      {
        name: "Men's Clothing",
        children: [
          { name: 'Shirts & Tees' },
          { name: 'Pants & Jeans' },
          { name: 'Suits & Blazers' },
          { name: 'Outerwear' },
          { name: 'Underwear & Sleepwear' },
        ],
      },
      {
        name: "Women's Clothing",
        children: [
          { name: 'Dresses' },
          { name: 'Tops' },
          { name: 'Bottoms' },
          { name: 'Outerwear' },
          { name: 'Lingerie & Sleepwear' },
        ],
      },
      {
        name: "Kids' Clothing",
        children: [
          { name: "Boys' Clothing" },
          { name: "Girls' Clothing" },
          { name: 'Baby Clothing' },
        ],
      },
      {
        name: 'Accessories',
        children: [
          { name: 'Jewelry' },
          { name: 'Bags & Wallets' },
          { name: 'Hats & Scarves' },
          { name: 'Belts & Suspenders' },
          { name: 'Sunglasses & Eyewear' },
        ],
      },
    ],
  },
  {
    name: 'Home & Garden',
    children: [
      {
        name: 'Furniture',
        children: [
          { name: 'Living Room Furniture' },
          { name: 'Bedroom Furniture' },
          { name: 'Kitchen Furniture' },
          { name: 'Dining Room Furniture' },
          { name: 'Office Furniture' },
        ],
      },
      {
        name: 'Home Decor',
        children: [
          { name: 'Wall Art' },
          { name: 'Rugs & Carpets' },
          { name: 'Bedding' },
          { name: 'Bath Towels' },
          { name: 'Tabletop Decor' },
        ],
      },
      {
        name: 'Garden Supplies',
        children: [
          { name: 'Tools & Equipment' },
          { name: 'Plants & Flowers' },
          { name: 'Outdoor Furniture' },
          { name: 'Grills & Smokers' },
          { name: 'Pool & Spa Supplies' },
        ],
      },
    ],
  },
  {
    name: 'Sports & Outdoors',
    children: [
      {
        name: 'Sporting Goods',
        children: [
          { name: 'Fitness Equipment' },
          { name: 'Team Sports Equipment' },
          { name: 'Individual Sports Equipment' },
          { name: 'Hunting & Fishing Gear' },
        ],
      },
      {
        name: 'Outdoor Gear',
        children: [
          { name: 'Camping Gear' },
          { name: 'Hiking & Backpacking Gear' },
          { name: 'Climbing Gear' },
          { name: 'Skiing & Snowboarding Gear' },
          { name: 'Water Sports Gear' },
        ],
      },
      {
        name: 'Activewear & Apparel',
      },
      {
        name: 'Footwear',
      },
    ],
  },
];

async function main() {
  await insertHierarchy(categoryData);

  console.log('>>> Categories inserted successfully!');
}

async function insertHierarchy(
  data: Hierarchy[],
  parentId: number | null = null
): Promise<void> {
  for (const item of data) {
    const data = parentId
      ? {
          name: item.name,
          parentId: parentId || undefined, // Set parent ID if provided
        }
      : {
          name: item.name,
        };

    // Insert
    let category: { id: number } | null = await prisma.category.findUnique({
      where: { name: data.name },
      select: { id: true },
    });
    if (!category) {
      category = await prisma.category.create({ data });
    }

    if (item.children && item.children.length > 0) {
      await insertHierarchy(item.children, category.id); // Recursive call for children with new parent ID
    }
  }
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
