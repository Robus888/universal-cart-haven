
import React from "react";
import { Product } from "@/contexts/ShopContext";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="product-card animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-1/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-full"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
