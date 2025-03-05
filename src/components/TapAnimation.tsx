
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TapRipple {
  id: number;
  x: number;
  y: number;
}

const TapAnimation: React.FC = () => {
  const [ripples, setRipples] = useState<TapRipple[]>([]);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove the ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 1000);
    };
    
    document.addEventListener("click", handleClick);
    
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  
  return (
    <AnimatePresence>
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none fixed w-12 h-12 -ml-6 -mt-6 rounded-full bg-shop-blue/30 z-50"
          style={{
            top: ripple.y,
            left: ripple.x
          }}
        />
      ))}
    </AnimatePresence>
  );
};

export default TapAnimation;
