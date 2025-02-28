
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useShop, Product } from "@/contexts/ShopContext";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface PaymentMethodsProps {
  product: Product;
  onComplete?: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ product, onComplete }) => {
  const { user, purchaseProduct } = useShop();
  const navigate = useNavigate();

  const handlePurchaseWithWallet = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign up required",
        description: "Please sign up or log in to purchase this product",
      });
      navigate("/login");
      return;
    }

    const price = product.discountedPrice || product.price;
    
    if (user.balance < price) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: (
          <div>
            <p>You don't have enough coins to purchase this product.</p>
            <a 
              href="https://t.me/yowxios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 font-semibold hover:underline"
            >
              Buy coins now
            </a>
          </div>
        ),
      });
      return;
    }

    const success = await purchaseProduct(product);
    if (success && onComplete) {
      onComplete();
    }
  };

  const openTelegramPayment = () => {
    window.open("https://t.me/yowxios", "_blank");
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="font-medium text-lg mb-2">Pay with wallet balance</h3>
        <Button 
          className="w-full bg-shop-blue hover:bg-shop-darkBlue"
          onClick={handlePurchaseWithWallet}
        >
          Use Wallet ({user ? `$${user.balance.toFixed(2)}` : "$0.00"})
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Other payment methods</h3>
        
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={openTelegramPayment}
        >
          <span>PayPal</span>
          <img src="https://cdn.iconscout.com/icon/free/png-256/free-paypal-26-283426.png" alt="PayPal" className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={openTelegramPayment}
        >
          <span>Zelle</span>
          <img src="https://1000logos.net/wp-content/uploads/2021/05/Zelle-logo.png" alt="Zelle" className="h-6 w-auto" />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={openTelegramPayment}
        >
          Your own payment method
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethods;
