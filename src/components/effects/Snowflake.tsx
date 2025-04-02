
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from 'next-themes';

interface SnowflakeProps {
  size?: number;
  color?: string;
  speedFactor?: number;
}

const Snowflake: React.FC<SnowflakeProps> = ({ 
  size = 8, 
  color = "white", 
  speedFactor = 1 
}) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100, // % of viewport width
    y: -20, // Start above viewport
  });
  const controls = useAnimation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Generate a random snowflake path
  const generatePath = () => {
    const startX = Math.random() * 100;
    const endX = startX + (Math.random() * 40 - 20); // random drift
    
    return {
      start: { x: startX, y: -20 }, // Start above viewport
      end: { x: endX, y: 120 }      // End below viewport
    };
  };

  // Animation for floating down
  useEffect(() => {
    const path = generatePath();
    setPosition(path.start);
    
    // Duration varies by speed factor and randomness
    const duration = (10 + Math.random() * 10) / speedFactor;
    
    const animate = async () => {
      await controls.start({
        x: [path.start.x, path.end.x],
        y: [path.start.y, path.end.y],
        transition: {
          duration,
          ease: "linear"
        }
      });
      
      // Reset with new path
      const newPath = generatePath();
      setPosition(newPath.start);
      animate();
    };
    
    animate();
    
    return () => {
      controls.stop();
    };
  }, [speedFactor, controls]);
  
  // Use appropriate color based on theme with increased opacity
  const snowflakeColor = isDarkMode ? "#ffffff" : "#c0e0ff";

  return (
    <motion.div
      animate={controls}
      initial={{ x: position.x, y: position.y }}
      style={{
        position: 'fixed',
        left: `${position.x}vw`,
        top: `${position.y}vh`,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color || snowflakeColor,
        boxShadow: `0 0 ${size/2}px ${color || snowflakeColor}`,
        opacity: 0.8,
        zIndex: 50,
        pointerEvents: 'none'
      }}
    />
  );
};

export default Snowflake;
