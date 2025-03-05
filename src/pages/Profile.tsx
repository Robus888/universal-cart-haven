
import React from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Profile: React.FC = () => {
  const { user } = useShop();
  
  // Create a formatted join date
  const joinDate = new Date();
  const daysJoined = 0;
  const formattedDate = format(joinDate, "MM/dd/yyyy - HH:mm:ss");

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-shop-blue flex items-center justify-center text-white text-2xl">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user?.username}</h2>
                  <p className="text-gray-500">{user?.email || "diadiejd5@gmail.com"}</p>
                  <p className="text-gray-500 mt-2">JOINED: {daysJoined} DAYS</p>
                  <p className="text-gray-500">{formattedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Profile;
