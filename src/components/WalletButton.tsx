
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { NavLink } from "react-router-dom";

const WalletButton: React.FC = () => {
  const { user } = useShop();
  
  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };
  
  return (
    <NavLink to="/wallet">
      <Button 
        className="wallet-button bg-shop-blue text-white hover:bg-shop-darkBlue flex items-center"
        variant="outline"
      >
        <Wallet className="h-4 w-4 mr-2" />
        <span>{user ? formatBalance(user.balance) : "$0.00"}</span>
      </Button>
    </NavLink>
  );
};

export default WalletButton;
