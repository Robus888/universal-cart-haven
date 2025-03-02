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
  
  // Get featured products (first 4 for now)
  const featuredProducts = products.slice(0, 4);
  
  return (
    <MainLayout>
      {/* Hero Section */}
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
            className="relative w-full max-w-full aspect-video"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* TikTok Video Embed */}
            <iframe 
              src="https://www.tiktok.com/embed/7476562410388655415" 
              width="100%" 
              height="500px" 
              allowFullScreen 
              className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            ></iframe>
          </motion.div>
        </div>
      </section>
      
      {/* Welcome Section for logged in users */}
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
              <Button variant="outline" size="sm">
                Add Funds
              </Button>
              <Button className="bg-shop-blue hover:bg-shop-darkBlue" size="sm">
                View History
              </Button>
            </div>
          </div>
        </motion.section>
      )}
      
      {/* Featured Products */}
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
      
      {/* Features */}
      <section className="mb-12 py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Why Choose Us</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            We provide the highest quality gaming products with unmatched service
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { icon: <Sparkles className="h-6 w-6 text-shop-blue" />, title: "Premium Quality", description: "Only the best gaming products are offered in our store" },
            { icon: <Shield className="h-6 w-6 text-shop-blue" />, title: "Secure Transactions", description: "Your payments and personal information are fully protected" },
            { icon: <Clock className="h-6 w-6 text-shop-blue" />, title: "Instant Delivery", description: "Receive your digital products immediately after purchase" },
            { icon: <CreditCard className="h-6 w-6 text-shop-blue" />, title: "Multiple Payment Options", description: "Choose from several convenient payment methods" }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="mb-4 rounded-full bg-shop-blue/10 p-3 w-12 h-12 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-shop-blue to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Enhance Your Gaming?</h2>
              <p className="text-white/80 mb-8 text-lg">
                Join thousands of satisfied gamers who have taken their experience to the next level
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-shop-blue hover:bg-gray-100">
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
'
