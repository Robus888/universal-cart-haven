
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShop } from "@/contexts/ShopContext";
import UserBanManager from "./UserBanManager";
import UserBalanceManager from "./UserBalanceManager";
import PromoCodeManager from "./PromoCodeManager";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const OwnerPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("balance");
  const { getTranslation, user } = useShop();
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold">{getTranslation("ownerPanel")}</h1>
      </div>
      
      <Tabs defaultValue="balance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 overflow-x-auto">
          <TabsTrigger value="balance">{getTranslation("wallet")}</TabsTrigger>
          <TabsTrigger value="ban">{getTranslation("users")}</TabsTrigger>
          <TabsTrigger value="promocodes">{getTranslation("promocodesManager")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="balance">
          <UserBalanceManager />
        </TabsContent>
        
        <TabsContent value="ban">
          <UserBanManager />
        </TabsContent>
        
        <TabsContent value="promocodes">
          <PromoCodeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerPanel;
