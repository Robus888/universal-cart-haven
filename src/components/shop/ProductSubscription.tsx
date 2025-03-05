
import React, { useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Clock, Calendar } from "lucide-react";

type SubscriptionPeriod = "weekly" | "monthly";

interface ProductSubscriptionProps {
  productId: string;
  onPeriodChange: (period: SubscriptionPeriod, price: number) => void;
}

const ProductSubscription: React.FC<ProductSubscriptionProps> = ({ 
  productId, 
  onPeriodChange 
}) => {
  const [period, setPeriod] = useState<SubscriptionPeriod>("weekly");
  const { currency } = useShop();
  
  // Prices for weekly and monthly subscriptions
  const subscriptionPrices: Record<string, { weekly: number, monthly: number }> = {
    "1": { weekly: 5.00, monthly: 20.00 },  // Pro Gaming Headset
    "2": { weekly: 5.00, monthly: 20.00 },  // Gaming Software Pro
    "3": { weekly: 4.50, monthly: 17.00 },  // Premium Game Key
  };
  
  const prices = subscriptionPrices[productId] || { weekly: 5.00, monthly: 20.00 };
  
  const handlePeriodChange = (value: string) => {
    if (value === "weekly" || value === "monthly") {
      setPeriod(value);
      onPeriodChange(value, prices[value]);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Subscription Period</h3>
        <span className="text-xs text-gray-500">Save up to 20% with monthly</span>
      </div>
      
      <ToggleGroup 
        type="single" 
        value={period} 
        onValueChange={handlePeriodChange} 
        className="justify-start"
      >
        <ToggleGroupItem 
          value="weekly" 
          className="flex items-center px-4 data-[state=on]:bg-shop-blue data-[state=on]:text-white"
        >
          <Clock className="mr-2 h-4 w-4" />
          Weekly ({currency} {prices.weekly.toFixed(2)})
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="monthly" 
          className="flex items-center px-4 data-[state=on]:bg-shop-blue data-[state=on]:text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Monthly ({currency} {prices.monthly.toFixed(2)})
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="mt-2 text-xs text-gray-500">
        {period === "weekly" ? (
          "Access for 7 days. Renews or expires after one week."
        ) : (
          "Access for 30 days. Better value with longer access period."
        )}
      </div>
    </div>
  );
};

export default ProductSubscription;
