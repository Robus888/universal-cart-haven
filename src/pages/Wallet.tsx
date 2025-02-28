
import React, { useEffect, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, RefreshCcw, ShoppingBag, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

type PurchaseHistory = {
  id: string;
  product_name: string;
  amount: number;
  created_at: string;
}

const Wallet: React.FC = () => {
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

  const handleRecharge = () => {
    window.open("https://t.me/yowxios", "_blank");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full bg-shop-blue/5 border-shop-blue/20">
              <CardHeader>
                <CardTitle className="text-shop-blue">Balance</CardTitle>
                <CardDescription>Your current account balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{user ? formatCurrency(user.balance) : formatCurrency(0)}</div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleRecharge} className="w-full bg-shop-blue hover:bg-shop-darkBlue">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Funds
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => navigate(0)}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop-blue"></div>
                  </div>
                ) : purchases.length > 0 ? (
                  <div className="space-y-4">
                    {purchases.slice(0, 5).map((purchase) => (
                      <div key={purchase.id}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <ShoppingBag className="mr-3 h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{purchase.product_name}</p>
                              <p className="text-xs text-gray-500">{formatDate(purchase.created_at)}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-red-500">-{formatCurrency(purchase.amount)}</p>
                        </div>
                        <Separator className="my-3" />
                      </div>
                    ))}
                    {purchases.length > 5 && (
                      <Button variant="link" className="w-full" onClick={() => navigate("/purchases")}>
                        View all transactions
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-gray-500">No purchase history found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Need help?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you need assistance with your wallet, purchases, or have any other questions, please feel free to contact our support team.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.open("https://t.me/yowxios", "_blank")}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Wallet;
