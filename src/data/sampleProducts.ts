
import { Product } from "@/types/shop";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Pro Gaming Headset",
    price: 99.99,
    discountedPrice: 79.99,
    description: "Professional gaming headset with noise cancellation and surround sound",
    features: [
      "Noise cancellation",
      "7.1 surround sound",
      "Adjustable microphone",
      "RGB lighting"
    ],
    stock: 15,
    image: "/lovable-uploads/af231cf1-f65f-4947-a1cb-fe4328f1d729.png",
    category: "Accessories",
    downloadLink: "https://mediafire2.com"
  },
  {
    id: "2",
    name: "Gaming Software Pro",
    price: 69.99,
    description: "Advanced gaming software with performance boosting features",
    features: [
      "ESP + Aimbot",
      "Performance optimization",
      "Auto-update system",
      "24/7 support"
    ],
    stock: 999,
    image: "/lovable-uploads/0292aa96-0ccd-4512-a886-ae373d37eeb8.png",
    category: "Software",
    downloadLink: "https://mediafire5.com"
  },
  {
    id: "3",
    name: "Premium Game Key",
    price: 59.99,
    description: "Premium activation key for the latest games",
    features: [
      "Instant delivery",
      "Global activation",
      "Lifetime warranty",
      "24/7 support"
    ],
    stock: 50,
    image: "/lovable-uploads/11233299-435c-4846-9a4b-9f7787856305.png",
    category: "Keys",
    downloadLink: "https://yowx33.com"
  }
];
