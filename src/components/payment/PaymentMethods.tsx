
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, ExternalLink, Wallet } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const PaymentMethods: React.FC = () => {
  const handleOpenPaymentPage = () => {
    window.open("https://t.me/yowxios", "_blank");
    
    toast({
      title: "Redirecting to payment",
      description: "You are being redirected to the payment page.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6" />
                <h3 className="font-medium">Credit Card</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Visa, Mastercard, Amex accepted</p>
            </div>
            
            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-center space-x-3">
                <Wallet className="h-6 w-6" />
                <h3 className="font-medium">PayPal</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Fast and secure payments</p>
            </div>
            
            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6" />
                <h3 className="font-medium">Cash App</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Quick money transfers</p>
            </div>
            
            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6" />
                <h3 className="font-medium">Zelle</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Bank-to-bank transfers</p>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleOpenPaymentPage}
          >
            Buy Coins Now
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
