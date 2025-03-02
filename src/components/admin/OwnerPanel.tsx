
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBalanceManager from "./UserBalanceManager";
import AnnouncementManager from "./AnnouncementManager";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UserBanManager from "./UserBanManager";

const OwnerPanel: React.FC = () => {
  const { user } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  if (!user?.is_owner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Access Denied</p>
          <p>You don't have permission to access the owner panel.</p>
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
        <h1 className="text-2xl font-bold">Owner Panel</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Ban Users</TabsTrigger>
          <TabsTrigger value="balance">Manage Balance</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserBanManager />
        </TabsContent>
        <TabsContent value="balance">
          <UserBalanceManager />
        </TabsContent>
        <TabsContent value="announcement">
          <AnnouncementManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerPanel;
