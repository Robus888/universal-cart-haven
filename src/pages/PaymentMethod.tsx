
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, Wallet, ArrowRight, Banknote } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";

const PaymentMethod: React.FC = () => {
  const { user } = useShop();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    toast({
      title: "Payment Method Selected",
      description: `${method} has been selected as your payment method.`,
    });
  };
  
  const handleBuyCoins = () => {
    if (!selectedMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Processing",
      description: "Redirecting to payment gateway...",
    });
    
    // In a real app, this would redirect to the payment processor
    setTimeout(() => {
      window.open("https://checkout.example.com", "_blank");
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Select your preferred payment method to add funds to your account
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Choose Payment Method</h2>
            </div>
            
            <CardContent className="pt-6">
              <Tabs defaultValue="credit-card" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="zelle">Zelle</TabsTrigger>
                  <TabsTrigger value="cash-app">Cash App</TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit-card" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleSelectMethod("Credit Card")}>
                    <div className="w-12 h-12 rounded-full bg-shop-blue flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Credit Card</h3>
                      <p className="text-sm text-white/70">Pay securely with your credit card</p>
                    </div>
                    {selectedMethod === "Credit Card" && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <div className="p-4 bg-white/5 border-b border-white/10">
                      <h3 className="font-medium">Add a new card</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white/70 mb-4">
                        Your card details will be securely processed through our payment provider.
                      </p>
                      <Button 
                        onClick={() => handleSelectMethod("Credit Card")}
                        className="bg-shop-blue hover:bg-shop-darkBlue"
                      >
                        Add Card
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="paypal" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleSelectMethod("PayPal")}>
                    <div className="w-12 h-12 rounded-full bg-[#0070ba] flex items-center justify-center">
                      <span className="text-white font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="font-medium">PayPal</h3>
                      <p className="text-sm text-white/70">Pay with your PayPal account</p>
                    </div>
                    {selectedMethod === "PayPal" && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <div className="p-4 bg-white/5 border-b border-white/10">
                      <h3 className="font-medium">Connect with PayPal</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white/70 mb-4">
                        You'll be redirected to PayPal to complete the connection.
                      </p>
                      <Button 
                        onClick={() => handleSelectMethod("PayPal")}
                        className="bg-[#0070ba] hover:bg-[#003087]"
                      >
                        Connect PayPal
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="zelle" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleSelectMethod("Zelle")}>
                    <div className="w-12 h-12 rounded-full bg-[#6d1ed4] flex items-center justify-center">
                      <span className="text-white font-bold">Z</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Zelle</h3>
                      <p className="text-sm text-white/70">Pay using Zelle transfer</p>
                    </div>
                    {selectedMethod === "Zelle" && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <div className="p-4 bg-white/5 border-b border-white/10">
                      <h3 className="font-medium">Zelle Payment Details</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white/70 mb-2">
                        Send payment to the following Zelle account:
                      </p>
                      <div className="p-3 bg-white/10 rounded-lg mb-4">
                        <p className="text-sm font-mono">payments@yowxmods.com</p>
                      </div>
                      <p className="text-sm text-white/70 mb-4">
                        After sending payment, contact support with your transaction ID.
                      </p>
                      <Button 
                        onClick={() => handleSelectMethod("Zelle")}
                        className="bg-[#6d1ed4] hover:bg-[#5a18b0]"
                      >
                        Select Zelle
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cash-app" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleSelectMethod("Cash App")}>
                    <div className="w-12 h-12 rounded-full bg-[#00d632] flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cash App</h3>
                      <p className="text-sm text-white/70">Pay with Cash App</p>
                    </div>
                    {selectedMethod === "Cash App" && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <div className="p-4 bg-white/5 border-b border-white/10">
                      <h3 className="font-medium">Cash App Payment Details</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white/70 mb-2">
                        Send payment to the following Cash App:
                      </p>
                      <div className="p-3 bg-white/10 rounded-lg mb-4">
                        <p className="text-sm font-mono">$YowxMods</p>
                      </div>
                      <p className="text-sm text-white/70 mb-4">
                        After sending payment, contact support with your transaction reference.
                      </p>
                      <Button 
                        onClick={() => handleSelectMethod("Cash App")}
                        className="bg-[#00d632] hover:bg-[#00b32a]"
                      >
                        Select Cash App
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 p-5 bg-shop-blue/20 rounded-lg border border-shop-blue/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Buy Coins Now</h3>
                  <Wallet className="h-5 w-5 text-shop-blue" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Starter</h4>
                      <Banknote className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold">$10.00</p>
                    <p className="text-sm text-white/70 mt-2">1,000 coins</p>
                  </div>
                  
                  <div className="bg-shop-blue/30 p-4 rounded-lg border border-shop-blue relative hover:bg-shop-blue/40 transition-colors cursor-pointer">
                    <div className="absolute -top-2 -right-2 bg-shop-blue text-white text-xs px-2 py-1 rounded">
                      Popular
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Standard</h4>
                      <Banknote className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold">$25.00</p>
                    <p className="text-sm text-white/70 mt-2">3,000 coins</p>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Premium</h4>
                      <Banknote className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold">$50.00</p>
                    <p className="text-sm text-white/70 mt-2">7,500 coins</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleBuyCoins}
                  className="w-full bg-shop-blue hover:bg-shop-darkBlue"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="mt-4 text-sm text-white/60 text-center">
                  *Additional payment processing fees may apply
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PaymentMethod;
