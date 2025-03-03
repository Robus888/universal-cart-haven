
import React from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/shop/ProductCard";
import { motion } from "framer-motion";

const PopularProducts: React.FC = () => {
  const { products } = useShop();
  
  // Find the Gaming Software Pro product
  const gamingSoftwarePro = products.find(product => product.id === "2");

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Popular Products</h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {gamingSoftwarePro ? (
            <div className="max-w-md mx-auto">
              <ProductCard product={gamingSoftwarePro} />
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PopularProducts;
