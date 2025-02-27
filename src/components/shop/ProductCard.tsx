
import React from "react";
import { useShop, Product } from "@/contexts/ShopContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currency, addToCart } = useShop();
  
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
            <Button 
              className="w-full bg-shop-blue hover:bg-shop-darkBlue"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </NavLink>
    </motion.div>
  );
};

export default ProductCard;
