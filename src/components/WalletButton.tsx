
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, RefreshCw } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const WalletButton: React.FC = () => {
  const { user } = useShop();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  
  useEffect(() => {
    if (user) {
      setCurrentBalance(user.balance);
    } else {
      setCurrentBalance(null);
    }
  }, [user]);

  const refreshBalance = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!user) return;
    
    try {
      setIsRefreshing(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setCurrentBalance(data.balance);
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };
  
  return (
    <div className="flex items-center">
      <NavLink to="/wallet">
        <Button 
          className="wallet-button bg-shop-blue text-white hover:bg-shop-darkBlue flex items-center"
          variant="outline"
        >
          <Wallet className="h-4 w-4 mr-2" />
          <span>{currentBalance !== null ? formatBalance(currentBalance) : user ? formatBalance(user.balance) : "$0.00"}</span>
        </Button>
      </NavLink>
      
      {user && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-1" 
          onClick={refreshBalance}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
};

export default WalletButton;
