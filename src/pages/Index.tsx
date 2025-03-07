
import React from "react";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const textVariants = {
  animate: {
    color: ["#4F46E5", "#8B5CF6", "#EC4899", "#3B82F6"],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  }
};

const Index = () => {
  const { getTranslation } = useShop();

  return (
    <div className="container max-w-4xl py-24">
      <section className="text-center">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 inline-block"
          variants={textVariants}
          animate="animate"
        >
          {getTranslation("welcomeMessage")}
        </motion.h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          {getTranslation("tagline")}
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Link to="/shop" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded shadow">
            {getTranslation("shopNow")}
          </Link>
          
          <Link to="/promocodes" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded shadow flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {getTranslation("redeemPromo")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
