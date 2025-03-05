
import React, { useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import type { Product } from "@/types/shop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { ShoppingCart, Eye, Download, Clock, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

type SubscriptionPeriod = "weekly" | "monthly";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    currency, 
    addToCart, 
    viewProductDetails, 
    isProductPurchased,
    isInCart
  } = useShop();

  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<SubscriptionPeriod>("weekly");
  
  const isPurchased = isProductPurchased(product.id);
  const isItemInCart = isInCart(product.id);
  
  // Prices for weekly and monthly subscriptions
  const subscriptionPrices: Record<string, { weekly: number, monthly: number }> = {
    "1": { weekly: 5.00, monthly: 20.00 },  // Pro Gaming Headset
    "2": { weekly: 5.00, monthly: 20.00 },  // Gaming Software Pro
    "3": { weekly: 4.50, monthly: 17.00 },  // Premium Game Key
  };
  
  const prices = subscriptionPrices[product.id] || { weekly: 5.00, monthly: 20.00 };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productWithSubscription = {
      ...product,
      price: prices[subscriptionPeriod],
      subscriptionPeriod
    };
    
    addToCart(productWithSubscription);
  };
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    viewProductDetails(product.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDownloadDialog(true);
  };

  const getDownloadLinks = () => {
    let downloadIpaLink = "https://www.mediafire.com/file/p06ndef7dsgvt9r/Free+Fire_1.108.1_1739330951.ipa/file";
    
    if (product.id === "1") {
      downloadIpaLink = "https://mediafire2.com";
    } else if (product.id === "2") {
      downloadIpaLink = "https://mediafire5.com";
    } else if (product.id === "3") {
      downloadIpaLink = "https://yowx33.com";
    }
    
    return {
      downloadIpa: downloadIpaLink,
      requestKey: "https://t.me/yowxios"
    };
  };
  
  return (
    <motion.div 
      className="product-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <NavLink to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={product.image || "https://via.placeholder.com/300x200"} 
            alt={product.name}
            className="w-full h-48 object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {product.discountedPrice && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Sale
            </Badge>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Only {product.stock} left
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
              <Badge variant="outline" className="text-white border-white">Out of Stock</Badge>
            </div>
          )}
          {isPurchased && (
            <Badge variant="default" className="absolute top-2 left-2 bg-green-600">
              Purchased
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{product.name}</h3>
          
          {!isPurchased && (
            <div className="mt-3">
              <Tabs 
                defaultValue="weekly" 
                onValueChange={(value) => setSubscriptionPeriod(value as SubscriptionPeriod)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="weekly" className="text-xs h-8 p-0">
                    <Clock className="mr-1 h-3 w-3" />
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs h-8 p-0">
                    <Calendar className="mr-1 h-3 w-3" />
                    Monthly
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="weekly" className="pt-2 pb-0">
                  <div className="text-center">
                    <span className="text-lg font-bold text-shop-blue">
                      {formatPrice(prices.weekly)}
                    </span>
                    <span className="text-xs block text-gray-500">7 days access</span>
                  </div>
                </TabsContent>
                
                <TabsContent value="monthly" className="pt-2 pb-0">
                  <div className="text-center">
                    <span className="text-lg font-bold text-shop-blue">
                      {formatPrice(prices.monthly)}
                    </span>
                    <span className="text-xs block text-gray-500">30 days access</span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {product.description}
          </p>
          
          <div className="mt-4 flex space-x-2">
            {isPurchased ? (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download IPA
              </Button>
            ) : (
              <Button 
                className="w-full bg-shop-blue hover:bg-shop-darkBlue"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isItemInCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isItemInCart ? "In Cart" : "Add to Cart"}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </NavLink>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download {product.name}</DialogTitle>
            <DialogDescription>
              Choose your download option below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button 
              className="w-full bg-shop-blue hover:bg-shop-darkBlue"
              onClick={() => window.open(getDownloadLinks().downloadIpa, "_blank")}
            >
              <Download className="mr-2 h-4 w-4" />
              Download IPA Now
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => window.open(getDownloadLinks().requestKey, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Request Key
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDownloadDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductCard;
