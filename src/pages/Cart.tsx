
import React from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, ShoppingCart, ArrowLeft, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Cart: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    currency, 
    calculateCartTotal, 
    user, 
    processCartPayment,
    isAuthenticated
  } = useShop();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    try {
      const success = await processCartPayment();
      if (success) {
        toast({
          title: "Payment successful",
          description: `Your purchase was completed. You can now download your items.`,
        });
        navigate("/downloads");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
      });
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cart.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div 
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">
                          {formatPrice(item.discountedPrice || item.price)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateCartTotal())}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(calculateCartTotal())}</span>
                  </div>
                  
                  {user && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md mt-4">
                      <p className="text-sm mb-1">Your balance</p>
                      <p className="font-bold">{formatPrice(user.balance)}</p>
                      {user.balance < calculateCartTotal() && (
                        <div className="flex items-center text-red-500 text-sm mt-2">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>Insufficient balance</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4 bg-shop-blue hover:bg-shop-darkBlue"
                    onClick={handleCheckout}
                    disabled={!isAuthenticated || (user && user.balance < calculateCartTotal()) || cart.length === 0}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/shop")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button onClick={() => navigate("/shop")} className="bg-shop-blue hover:bg-shop-darkBlue">
              Browse Shop
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
