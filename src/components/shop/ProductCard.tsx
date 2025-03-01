
import React, { useState } from "react";
import { useShop, Product } from "@/contexts/ShopContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

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
  const isPurchased = isProductPurchased(product.id);
  const isItemInCart = isInCart(product.id);
  
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
    addToCart(product);
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
          
          <div className="mt-2 flex items-center space-x-2">
            {product.discountedPrice ? (
              <>
                <span className="text-lg font-bold text-shop-blue">
                  {formatPrice(product.discountedPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-shop-blue">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
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
                {isItemInCart ? "Already in Cart" : "Add to Cart"}
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
