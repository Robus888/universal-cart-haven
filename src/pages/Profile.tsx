
import React, { useEffect, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useShop();
  const navigate = useNavigate();
  const [joinDays, setJoinDays] = useState(0);
  const [joinDate, setJoinDate] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      // Calculate days since joined
      const created = user.created_at ? new Date(user.created_at) : new Date();
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - created.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setJoinDays(diffDays);

      // Format join date
      setJoinDate(created.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }) + ' - ' + created.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }
  }, [user, isAuthenticated, navigate]);

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-shop-blue"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{user.email || "diadiejd5@gmail.com"}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Account Age</p>
                  <p className="text-gray-600">JOINED: {joinDays} DAYS</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Join Date</p>
                  <p className="text-gray-600">{joinDate || "03/02/2025 - 20:49:54"}</p>
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
