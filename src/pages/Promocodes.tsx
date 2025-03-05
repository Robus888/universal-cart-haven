
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { Ticket, RefreshCw } from "lucide-react";

const Promocodes: React.FC = () => {
  const { user, refreshUserData } = useShop();
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>(() => {
    if (user) {
      const saved = localStorage.getItem(`redeemedCodes_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // Sample promo codes (in a real app, these would be in the database)
  const validPromoCodes: Record<string, { amount: number, maxRedeems: number, currentRedeems: number }> = {
    "WELCOME50": { amount: 5.00, maxRedeems: 100, currentRedeems: 45 },
    "SUMMER25": { amount: 2.50, maxRedeems: 200, currentRedeems: 120 },
    "BONUS15": { amount: 1.50, maxRedeems: 500, currentRedeems: 320 },
    "VIP100": { amount: 10.00, maxRedeems: 50, currentRedeems: 25 },
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to redeem promo codes",
        variant: "destructive"
      });
      return;
    }
    
    if (!promoCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a promo code",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Check if code has already been redeemed by this user
    if (redeemedCodes.includes(promoCode)) {
      toast({
        title: "Already Redeemed",
        description: "You've already redeemed this promo code",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Validate promo code
    const codeInfo = validPromoCodes[promoCode];
    
    if (!codeInfo) {
      toast({
        title: "Invalid Code",
        description: "This promo code is invalid or has expired",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Check if max redeems reached
    if (codeInfo.currentRedeems >= codeInfo.maxRedeems) {
      toast({
        title: "Code Expired",
        description: "This promo code has reached its maximum redemption limit",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulate API call
      setTimeout(async () => {
        // Update redeemed codes
        const newRedeemedCodes = [...redeemedCodes, promoCode];
        setRedeemedCodes(newRedeemedCodes);
        localStorage.setItem(`redeemedCodes_${user.id}`, JSON.stringify(newRedeemedCodes));
        
        // Refresh user data to update balance
        await refreshUserData();
        
        toast({
          title: "Code Redeemed!",
          description: `You've received $${codeInfo.amount.toFixed(2)}!`,
        });
        
        setPromoCode("");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error redeeming promo code:", error);
      toast({
        title: "Error",
        description: "Failed to redeem promo code. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Promocodes</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Redeem promo codes to get free coins and other rewards
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center">
              <Ticket className="mr-2 h-5 w-5 text-shop-blue" />
              <h2 className="text-xl font-bold">Redeem Promo Code</h2>
            </div>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="promoCode" className="block text-sm font-medium mb-2">
                    Enter Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME50"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      maxLength={20}
                      autoComplete="off"
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-shop-blue hover:bg-shop-darkBlue min-w-[100px]"
                    >
                      {isLoading ? "Redeeming..." : "Redeem"}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Recently Redeemed</h3>
                  {redeemedCodes.length > 0 ? (
                    <div className="space-y-2">
                      {redeemedCodes.slice(0, 3).map((code, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white/10 rounded">
                          <span className="font-mono">{code}</span>
                          <span className="text-green-400 text-sm">+${validPromoCodes[code]?.amount.toFixed(2) || "0.00"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-white/50 text-sm">
                      <p>You haven't redeemed any promo codes yet</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm text-white/70 pt-2">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span>New promo codes are released regularly</span>
                  </div>
                  <div>{redeemedCodes.length} redeemed</div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Promocodes;
