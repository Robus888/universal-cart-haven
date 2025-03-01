
import { Product } from "@/types/shop";

export const filterProductsByCategory = (products: Product[], category?: string): Product[] => {
  if (!category) {
    return products;
  } else {
    return products.filter((product) => product.category === category);
  }
};

export const filterProductsBySearch = (products: Product[], query: string): Product[] => {
  if (query.trim() === "") {
    return products;
  } else {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const getDownloadLink = (products: Product[], productId: string): string => {
  const product = products.find(p => p.id === productId);
  return product?.downloadLink || "#";
};

export const viewProductDetails = (productId: string): void => {
  window.open("https://t.me/yowxios", "_blank");
};
