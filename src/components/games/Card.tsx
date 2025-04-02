
import React from 'react';

interface CardProps {
  suit: string;
  value: string;
  hidden?: boolean;
}

const Card: React.FC<CardProps> = ({ suit, value, hidden = false }) => {
  const getColor = () => {
    if (hidden) return 'text-white';
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900 dark:text-gray-100';
  };

  const getSymbol = () => {
    if (hidden) return '?';
    return value;
  };
  
  const getSuit = () => {
    if (hidden) return '';
    return suit;
  };

  return (
    <div className={`relative w-16 h-24 rounded-md shadow-md ${hidden ? 'bg-blue-800' : 'bg-white dark:bg-gray-800'} border border-gray-300 dark:border-gray-700 flex flex-col justify-between p-2`}>
      <div className={`text-sm font-bold ${getColor()}`}>
        {getSymbol()}
      </div>
      <div className={`text-center text-xl ${getColor()}`}>
        {getSuit()}
      </div>
      <div className={`text-sm font-bold rotate-180 ${getColor()}`}>
        {getSymbol()}
      </div>
    </div>
  );
};

export default Card;
