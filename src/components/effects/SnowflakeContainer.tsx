
import React from 'react';
import Snowflake from './Snowflake';

interface SnowflakeContainerProps {
  count?: number;
}

const SnowflakeContainer: React.FC<SnowflakeContainerProps> = ({ count = 50 }) => {
  // Create an array to hold our snowflakes with improved variety
  const snowflakes = Array.from({ length: count }, (_, index) => ({
    id: `snowflake-${index}`,
    size: 3 + Math.random() * 10, // Slightly bigger snowflakes
    speedFactor: 0.3 + Math.random() * 1.2 // More variation in speed
  }));

  return (
    <div className="snowflake-container fixed inset-0 pointer-events-none z-50">
      {snowflakes.map(flake => (
        <Snowflake
          key={flake.id}
          size={flake.size}
          speedFactor={flake.speedFactor}
        />
      ))}
    </div>
  );
};

export default SnowflakeContainer;
