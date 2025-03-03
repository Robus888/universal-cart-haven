
import React from "react";
import ChangePassword from "@/components/settings/ChangePassword";
import ChangeUsername from "@/components/settings/ChangeUsername";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShop } from "@/contexts/ShopContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const Settings: React.FC = () => {
  const { isAuthenticated } = useShop();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your account preferences and security
          </p>
        </div>

        <Tabs defaultValue="password" className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="password">Change Password</TabsTrigger>
            <TabsTrigger value="username">Change Username</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <ChangePassword />
          </TabsContent>
          
          <TabsContent value="username">
            <ChangeUsername />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
