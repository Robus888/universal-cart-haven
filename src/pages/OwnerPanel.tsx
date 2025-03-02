
import React, { useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBanManager from "@/components/admin/UserBanManager";
import UserBalanceManager from "@/components/admin/UserBalanceManager";
import AnnouncementManager from "@/components/admin/AnnouncementManager";

const OwnerPanel: React.FC = () => {
  const { user } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  // Redirect non-owners to home
  if (!user?.is_owner && !user?.is_admin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Access Denied</p>
          <p>You don't have permission to access this page.</p>
        </div>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {user?.is_owner ? "Owner Panel" : "Admin Panel"}
        </h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {user?.is_owner && <TabsTrigger value="users">Ban Users</TabsTrigger>}
          <TabsTrigger value="balance">Manage Balance</TabsTrigger>
          {user?.is_owner && <TabsTrigger value="announcement">Announcements</TabsTrigger>}
        </TabsList>
        
        {user?.is_owner && (
          <TabsContent value="users">
            <UserBanManager />
          </TabsContent>
        )}
        
        <TabsContent value="balance">
          <UserBalanceManager />
        </TabsContent>
        
        {user?.is_owner && (
          <TabsContent value="announcement">
            <AnnouncementManager />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OwnerPanel;
