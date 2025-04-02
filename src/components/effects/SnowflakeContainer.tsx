
import React from 'react';
import Snowflake from './Snowflake';

interface SnowflakeContainerProps {
  count?: number;
}

const SnowflakeContainer: React.FC<SnowflakeContainerProps> = ({ count = 30 }) => {
  // Create an array to hold our snowflakes
  const snowflakes = Array.from({ length: count }, (_, index) => ({
    id: `snowflake-${index}`,
    size: 3 + Math.random() * 8,
    speedFactor: 0.5 + Math.random()
  }));

  return (
    <div className="snowflake-container">
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
