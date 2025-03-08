
import React from "react";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingCart, Award, Clock } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const titleVariants = {
  animate: {
    color: ["#4F46E5", "#8B5CF6", "#EC4899", "#3B82F6"],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const Index = () => {
  const { getTranslation } = useShop();

  return (
    <div className="container max-w-6xl py-16 md:py-24">
      <motion.section 
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="mb-12">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 inline-block"
            variants={titleVariants}
            animate="animate"
          >
            Welcome to our new shop
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
            variants={fadeInUp}
          >
            Discover premium digital products tailored for gamers and tech enthusiasts. 
            Our curated collection brings you the best in gaming, productivity, and digital assets.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-4">
              <Sparkles className="h-10 w-10 text-shop-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">
              All our products are carefully vetted to ensure the highest standards of quality and performance.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-10 w-10 text-shop-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Shop with confidence using our secure payment systems and protected checkout process.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-4">
              <Award className="h-10 w-10 text-shop-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our dedicated support team ensures you get the help you need, whenever you need it.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative overflow-hidden rounded-xl shadow-xl mb-12 max-w-4xl mx-auto"
          variants={fadeInUp}
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 absolute inset-0 z-0"></div>
          <div className="relative z-10 p-8 text-left">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-shop-blue mr-2" />
              <span className="text-sm font-medium text-shop-blue">Limited Time Offer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Special Launch Promotion</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Join our community today and get exclusive access to special promotions, early product releases, and premium support.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/shop" className="inline-block bg-shop-blue hover:bg-shop-darkBlue text-white font-bold py-3 px-8 rounded-md shadow-md transition-all duration-300">
                {getTranslation("shopNow")}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Index;
