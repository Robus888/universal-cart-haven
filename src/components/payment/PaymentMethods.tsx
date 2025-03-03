
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, PaypalIcon, Send } from "lucide-react";

// Custom PayPal icon since it's not in Lucide
const PaypalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.067 7.297C20.067 10.764 17.77 12.257 14.828 12.257H13.638C13.345 12.257 13.105 12.488 13.065 12.779L12.565 16.193L12.277 18.011C12.247 18.211 12.407 18.4 12.611 18.4H14.575C14.825 18.4 15.036 18.211 15.07 17.968L15.082 17.899L15.463 15.565L15.477 15.475C15.512 15.232 15.723 15.043 15.971 15.043H16.265C18.8 15.043 20.857 13.765 21.375 10.764C21.603 9.425 21.494 8.331 20.84 7.571C20.614 7.3 20.318 7.095 20.067 7.297Z" fill="#179BD7"/>
    <path d="M19.125 6.992C19.064 6.969 19.001 6.947 18.938 6.925C18.875 6.903 18.81 6.884 18.742 6.864C18.309 6.754 17.825 6.7 17.3 6.7H13.638C13.561 6.7 13.485 6.719 13.417 6.751C13.27 6.814 13.155 6.94 13.125 7.096L12.375 12.052L12.312 12.476C12.353 12.185 12.593 11.954 12.887 11.954H14.839C17.78 11.954 20.078 10.459 20.078 6.992C20.078 6.711 20.042 6.451 19.974 6.21C19.738 6.448 19.451 6.641 19.125 6.992Z" fill="#253B80"/>
    <path d="M13.125 7.102C13.155 6.948 13.27 6.82 13.419 6.757C13.487 6.725 13.563 6.708 13.639 6.708H17.3C17.825 6.708 18.309 6.76 18.742 6.872C18.81 6.891 18.875 6.911 18.938 6.934C19.001 6.956 19.064 6.978 19.125 7.002C19.263 7.052 19.396 7.109 19.523 7.177C19.68 6.396 19.522 5.893 19.095 5.377C18.626 4.809 17.768 4.5 16.7 4.5H12.075C11.783 4.5 11.531 4.731 11.491 5.021L9.675 16.477C9.638 16.711 9.825 16.921 10.062 16.921H12.563L13.125 13.264L13.125 7.102Z" fill="#222D65"/>
  </svg>
);

// Cash App icon
const CashAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM14.4 15.5C13.9 16 13.2 16.3 12.4 16.3C11.4 16.3 10.6 15.9 10 15.1C9.8 14.9 9.9 14.6 10.1 14.4L10.8 13.7C11 13.5 11.3 13.5 11.5 13.7C11.7 14 12 14.2 12.4 14.2C12.9 14.2 13.2 13.9 13.2 13.5C13.2 13.1 12.9 12.8 12.4 12.8H11.8C11.5 12.8 11.3 12.6 11.3 12.3V11.5C11.3 11.2 11.5 11 11.8 11H12.4C12.8 11 13.1 10.7 13.1 10.3C13.1 9.9 12.8 9.6 12.4 9.6C12 9.6 11.7 9.8 11.5 10.1C11.3 10.3 11 10.3 10.8 10.1L10.1 9.4C9.9 9.2 9.8 8.9 10 8.7C10.6 7.9 11.4 7.5 12.4 7.5C13.2 7.5 13.9 7.8 14.4 8.3C14.9 8.8 15.2 9.5 15.2 10.3C15.2 11.2 14.7 12 14 12.3C14.8 12.6 15.3 13.4 15.3 14.3C15.2 15.1 14.9 15.8 14.4 15.5Z" fill="#00D632"/>
  </svg>
);

// Zelle icon
const ZelleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.2 4H4.8C3.2536 4 2 5.2536 2 6.8V17.2C2 18.7464 3.2536 20 4.8 20H19.2C20.7464 20 22 18.7464 22 17.2V6.8C22 5.2536 20.7464 4 19.2 4Z" fill="#6D1ED4"/>
    <path d="M16.2445 9.89116L10.7333 15.4023H14.7556C15.0437 15.4023 15.2778 15.1682 15.2778 14.8801C15.2778 14.592 15.0437 14.3579 14.7556 14.3579H12.5778L16.7667 10.1691C16.9778 9.95804 16.9778 9.65693 16.7667 9.47071C16.5556 9.25482 16.2545 9.25482 16.2445 9.89116Z" fill="white"/>
    <path d="M9.24445 14.1147L14.7557 8.59766H10.7334C10.4453 8.59766 10.2112 8.83175 10.2112 9.11987C10.2112 9.40798 10.4453 9.64208 10.7334 9.64208H12.9112L8.72232 13.8309C8.51121 14.042 8.51121 14.3431 8.72232 14.5293C8.93343 14.7452 9.23454 14.7452 9.24455 14.1088V14.1147Z" fill="white"/>
  </svg>
);

const PaymentMethods: React.FC = () => {
  const handleBuyCoinsClick = () => {
    window.open('https://t.me/yowxios', '_blank');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Select a payment method to purchase coins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 hover:border-primary cursor-pointer transition-all">
            <CardHeader className="pb-2">
              <PaypalIcon />
              <CardTitle className="text-xl">PayPal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Fast and secure online payments</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-primary cursor-pointer transition-all">
            <CardHeader className="pb-2">
              <ZelleIcon />
              <CardTitle className="text-xl">Zelle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Direct bank transfers</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-primary cursor-pointer transition-all">
            <CardHeader className="pb-2">
              <CashAppIcon />
              <CardTitle className="text-xl">Cash App</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Mobile payment service</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-primary cursor-pointer transition-all">
            <CardHeader className="pb-2">
              <CreditCard className="h-6 w-6" />
              <CardTitle className="text-xl">Credit Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Visa, Mastercard, and more</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBuyCoinsClick} 
          size="lg" 
          className="w-full bg-red-600 hover:bg-red-700"
        >
          <Send className="mr-2 h-4 w-4" />
          Buy Coins Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethods;
