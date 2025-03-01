import React from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductGrid from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Sparkles, Shield, Clock, CreditCard } from "lucide-react";

const Index: React.FC = () => {
  const { products, isAuthenticated, user } = useShop();
  const featuredProducts = products.slice(0, 4);
  
  return (
    <MainLayout>
      <section className="py-10 mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Enhance Your Gaming Experience
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Discover premium gaming products designed to take your gaming to the next level.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-shop-blue hover:bg-shop-darkBlue text-white px-6">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button variant="outline">
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative p-1 rounded-xl border-4 border-transparent bg-clip-padding"
            style={{ borderImage: "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet) 1" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <video 
                src="/lovable-uploads/sample-video.mp4" 
                controls 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-shop-blue text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
              Premium Quality
            </div>
          </motion.div>
        </div>
      </section>
      
      {isAuthenticated && user && (
        <motion.section 
          className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Welcome back, {user.username}!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your current balance: <span className="font-medium">${user.balance.toFixed(2)}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Add Funds</Button>
              <Button className="bg-shop-blue hover:bg-shop-darkBlue" size="sm">View History</Button>
            </div>
          </div>
        </motion.section>
      )}
      
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our most popular gaming enhancers
            </p>
          </div>
          <NavLink to="/shop" className="text-shop-blue hover:underline font-medium flex items-center">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </NavLink>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </MainLayout>
  );
};

export default Index;
