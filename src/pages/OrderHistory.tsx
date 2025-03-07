
import React, { useEffect, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type PurchaseHistory = {
  id: string;
  product_name: string;
  amount: number;
  created_at: string;
}

const OrderHistory: React.FC = () => {
  const { user, isAuthenticated, currency } = useShop();
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchPurchases = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching purchases:", error);
          return;
        }
        
        setPurchases(data || []);
      } catch (error) {
        console.error("Error in fetchPurchases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [user, isAuthenticated, navigate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        View all your past purchases and transactions
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-shop-blue"></div>
        </div>
      ) : purchases.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md font-medium">{purchase.product_name}</CardTitle>
                  <span className="text-red-500 font-semibold">{formatCurrency(purchase.amount)}</span>
                </div>
                <p className="text-xs text-gray-500">{formatDate(purchase.created_at)}</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <ShoppingBag className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm">Order ID: {purchase.id.substring(0, 8)}</p>
                    <p className="text-xs text-gray-500">Successfully processed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No order history</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't made any purchases yet.</p>
          <Button onClick={() => navigate("/shop")} className="bg-shop-blue hover:bg-shop-darkBlue">
            Browse Shop
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
