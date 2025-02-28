
import React, { useEffect, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Download, ExternalLink, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

type Purchase = {
  id: string;
  product_id: string;
  product_name: string;
  created_at: string;
}

const Downloads: React.FC = () => {
  const { user, isAuthenticated, products, getDownloadLink } = useShop();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (productId: string) => {
    window.open(getDownloadLink(productId), "_blank");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Downloads</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-shop-blue"></div>
          </div>
        ) : purchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase, index) => {
              const product = products.find(p => p.id === purchase.product_id);
              return (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{purchase.product_name}</CardTitle>
                      <p className="text-sm text-gray-500">Purchased on {formatDate(purchase.created_at)}</p>
                    </CardHeader>
                    <CardContent>
                      <Separator className="my-3" />
                      <div className="mt-4 flex space-x-3">
                        <Button 
                          onClick={() => handleDownload(purchase.product_id)}
                          className="flex-1 bg-shop-blue hover:bg-shop-darkBlue"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        {product && (
                          <Button 
                            variant="outline"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No downloads available</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't purchased any products yet.</p>
            <Button onClick={() => navigate("/shop")} className="bg-shop-blue hover:bg-shop-darkBlue">
              Browse Shop
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Downloads;
