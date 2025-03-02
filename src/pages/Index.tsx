import React, { useRef, useState, useEffect } from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductGrid from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, PauseCircle, PlayCircle } from "lucide-react";

const colorVariants = {
  animate: {
    color: ["#017418", "#000000", "#df0000", "#000000"],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

const Index: React.FC = () => {
  const { products, isAuthenticated, user } = useShop();
  const featuredProducts = products.slice(0, 4);
  
  // Video control states
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Function to reload the video for looping effect
  const reloadVideo = () => {
    if (videoRef.current) {
      videoRef.current.src = videoRef.current.src;
    }
  };

  // Auto-reload the video every 30 seconds (adjust timing based on video length)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        reloadVideo();
      }
    }, 30000); // Adjust timing based on the average video length

    return () => clearInterval(interval);
  }, [isPaused]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPaused) {
        reloadVideo(); // Restart video if paused
      }
      setIsPaused(!isPaused);
    }
  };

  return (
    <MainLayout>
      <section className="py-10 mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold leading-tight mb-4 text-center md:text-6xl">
              Welcome to the best hacks store
            </h1>
            <motion.p className="mb-8 mx-[2px] text-xl" variants={colorVariants} animate="animate">
              Join the dark side with the best mod menus on the market for your favorite antiban game
            </motion.p>
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

          {/* Video Section */}
          <motion.div
            className="relative w-full max-w-full aspect-video"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <iframe
              ref={videoRef}
              src="https://www.tiktok.com/embed/7476562410388655415?autoplay=1&mute=0"
              width="100%"
              height="500px"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            />
            <Button
              onClick={toggleVideo}
              className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
            >
              {isPaused ? <PlayCircle className="mr-2" /> : <PauseCircle className="mr-2" />}
              {isPaused ? "Play Video" : "Pause Video"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Welcome Section for Authenticated Users */}
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

      {/* Featured Products Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-300">Our most popular gaming enhancers</p>
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
