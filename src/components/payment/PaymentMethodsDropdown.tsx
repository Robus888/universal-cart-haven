
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "paypal",
    name: "PayPal",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.2 6.35c.15.91-.1 1.71-.4 2.41-.8 1.91-2.7 2.72-4.6 2.72h-.5c-.4 0-.7.3-.8.6l-.5 3.21-.2 1.11c-.1.4-.4.61-.8.61H9.6c-.3 0-.5-.3-.4-.7l1.9-12.02c.1-.4.5-.61.8-.61h5.3c.72 0 1.4.1 1.8.4a2 2 0 0 1 1.1 2.28Z" /><path opacity=".68" d="M7.2 17.91c-.1 0-.2 0-.3-.1-.2-.1-.3-.3-.2-.6l1.4-8.92c.2-1.2 1.4-2.4 2.7-2.4h4.8c.7 0 1.2.2 1.6.4.1 0 .2.1.2.2l.1.1v.1c-.6-.7-1.7-.8-2.9-.8H9.4c-1.5 0-2.8.91-3.1 2.41L4.6 18.2c-.1.41.2.72.6.72h2.5c-.3 0-.5-.3-.5-.61v-.4Z" />
    </svg>,
  },
  {
    id: "zelle",
    name: "Zelle",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" /><path d="M11.5 7.5 15 12l-3.5 4.5h-3L12 12 8.5 7.5h3z" fill="white" />
    </svg>,
  },
  {
    id: "cashapp",
    name: "Cash App",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    id: "creditcard",
    name: "Credit Card",
    icon: <CreditCard className="h-4 w-4" />,
  },
];

const PaymentMethodsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    toast({
      title: "Payment Method Selected",
      description: `You selected ${method.name} as your payment method.`,
    });
    
    // You can add additional logic here to handle the payment method selection
    window.open("https://t.me/yowxios", "_blank");
  };

  return (
    <div className="flex flex-col space-y-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-transparent backdrop-blur-sm hover:bg-white/10 text-white border-white/20"
          >
            <div className="flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              Payment Methods
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] bg-black/80 backdrop-blur-md border-white/20">
          {paymentMethods.map((method) => (
            <DropdownMenuItem 
              key={method.id} 
              className="cursor-pointer py-3 flex items-center text-white hover:bg-white/10"
              onClick={() => handlePaymentMethodSelect(method)}
            >
              <span className="mr-2">{method.icon}</span>
              {method.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        onClick={() => window.open("https://t.me/yowxios", "_blank")}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold"
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Buy Coins Now
      </Button>
    </div>
  );
};

export default PaymentMethodsDropdown;
