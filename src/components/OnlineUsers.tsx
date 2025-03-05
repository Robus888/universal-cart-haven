
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const OnlineUsers: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  
  useEffect(() => {
    // Simulate online users
    const randomOnline = Math.floor(Math.random() * 20) + 5; // Between 5 and 25 users
    setOnlineCount(randomOnline);
    
    // Update every 30 seconds with a slight change
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2 change
      setOnlineCount(prev => Math.max(3, prev + change));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div 
      className="fixed top-4 left-4 z-50 flex items-center bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Users size={16} className="mr-2 text-shop-blue" />
      <span className="text-sm font-medium">{onlineCount} online</span>
    </motion.div>
  );
};

export default OnlineUsers;
