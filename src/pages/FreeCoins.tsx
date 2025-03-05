
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { Calendar, Gift, Clock, AlertCircle } from "lucide-react";

const FreeCoins: React.FC = () => {
  const { user, refreshUserData } = useShop();
  const [claimedDays, setClaimedDays] = useState<number[]>([]);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [nextClaimTime, setNextClaimTime] = useState<string>("24:00:00");
  const [isLoading, setIsLoading] = useState(false);
  
  // Days of the week
  const daysOfWeek = [
    { day: "Monday", reward: 0.50 },
    { day: "Tuesday", reward: 0.50 },
    { day: "Wednesday", reward: 0.50 },
    { day: "Thursday", reward: 0.50 },
    { day: "Friday", reward: 0.50 },
    { day: "Saturday", reward: 0.50 },
    { day: "Sunday", reward: 0.50 }
  ];
  
  // Load claimed days from localStorage
  useEffect(() => {
    if (user) {
      const savedClaimedDays = localStorage.getItem(`claimedDays_${user.id}`);
      const savedLastClaimDate = localStorage.getItem(`lastClaimDate_${user.id}`);
      
      if (savedClaimedDays) {
        setClaimedDays(JSON.parse(savedClaimedDays));
      }
      
      if (savedLastClaimDate) {
        setLastClaimDate(savedLastClaimDate);
        
        // Check if we need to reset (new week)
        const lastDate = new Date(savedLastClaimDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 7) {
          // Reset for new week
          setClaimedDays([]);
          localStorage.removeItem(`claimedDays_${user.id}`);
          localStorage.removeItem(`lastClaimDate_${user.id}`);
        } else {
          // Set next claim countdown
          updateNextClaimTime(lastDate);
        }
      }
    }
  }, [user]);
  
  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastClaimDate) {
        const lastDate = new Date(lastClaimDate);
        updateNextClaimTime(lastDate);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastClaimDate]);
  
  const updateNextClaimTime = (lastDate: Date) => {
    const now = new Date();
    const nextClaimDate = new Date(lastDate);
    nextClaimDate.setHours(nextClaimDate.getHours() + 24);
    
    if (nextClaimDate > now) {
      const diff = nextClaimDate.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setNextClaimTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    } else {
      setNextClaimTime("00:00:00");
    }
  };
  
  const handleClaim = async (dayIndex: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to claim your daily rewards",
        variant: "destructive"
      });
      return;
    }
    
    // Check if already claimed
    if (claimedDays.includes(dayIndex)) {
      toast({
        title: "Already Claimed",
        description: "You've already claimed this day's reward",
        variant: "destructive"
      });
      return;
    }
    
    // Check if previous day is claimed (except for day 0)
    if (dayIndex > 0 && !claimedDays.includes(dayIndex - 1)) {
      toast({
        title: "Claim Error",
        description: "You need to claim the previous day first",
        variant: "destructive"
      });
      return;
    }
    
    // Check if we can claim today (24h since last claim)
    const now = new Date();
    if (lastClaimDate) {
      const lastDate = new Date(lastClaimDate);
      const diffHours = Math.abs(now.getTime() - lastDate.getTime()) / 36e5;
      
      if (diffHours < 24) {
        toast({
          title: "Claim Error",
          description: `You can claim again in ${nextClaimTime}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Update user balance
      const reward = daysOfWeek[dayIndex].reward;
      
      // This would normally be a Supabase database update
      setTimeout(async () => {
        // Save to localStorage
        const newClaimedDays = [...claimedDays, dayIndex];
        setClaimedDays(newClaimedDays);
        
        const nowStr = now.toISOString();
        setLastClaimDate(nowStr);
        
        localStorage.setItem(`claimedDays_${user.id}`, JSON.stringify(newClaimedDays));
        localStorage.setItem(`lastClaimDate_${user.id}`, nowStr);
        
        // Refresh user data to update balance
        await refreshUserData();
        
        toast({
          title: "Reward Claimed!",
          description: `You've received $${reward.toFixed(2)}!`,
        });
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const canClaimToday = !lastClaimDate || (new Date().getTime() - new Date(lastClaimDate).getTime()) >= 24 * 60 * 60 * 1000;
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Free Coins</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Claim your daily reward and come back tomorrow for more!
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-shop-blue" />
                <h2 className="text-xl font-bold">Daily Rewards</h2>
              </div>
              
              {lastClaimDate && (
                <div className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                  <Clock className="mr-1 h-4 w-4 text-yellow-400" />
                  <span>Next claim: {nextClaimTime}</span>
                </div>
              )}
            </div>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {daysOfWeek.map((day, index) => (
                  <div 
                    key={index}
                    className={`relative overflow-hidden rounded-lg border ${
                      claimedDays.includes(index) 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="p-4 text-center">
                      <h3 className="font-medium">{day.day}</h3>
                      <div className="my-3 p-2 bg-black/30 rounded-lg flex justify-center items-center">
                        <Gift className="h-8 w-8 text-shop-blue" />
                      </div>
                      <p className="text-sm text-white/70 mb-2">Reward</p>
                      <p className="text-lg font-bold">${day.reward.toFixed(2)}</p>
                      
                      <Button
                        onClick={() => handleClaim(index)}
                        disabled={isLoading || claimedDays.includes(index) || (index > 0 && !claimedDays.includes(index - 1)) || !canClaimToday}
                        className={`w-full mt-3 ${
                          claimedDays.includes(index)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-shop-blue hover:bg-shop-darkBlue'
                        }`}
                      >
                        {claimedDays.includes(index) ? (
                          <>Claimed</>
                        ) : isLoading ? (
                          <>Claiming...</>
                        ) : (
                          <>Claim</>
                        )}
                      </Button>
                    </div>
                    
                    {claimedDays.includes(index) && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-500 text-white p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-500">Important</h4>
                    <p className="text-sm text-white/70">
                      You must claim each day in order. The weekly rewards reset after 7 days.
                      You can only claim once every 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default FreeCoins;
