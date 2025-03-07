
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShop } from "@/contexts/ShopContext";
import UserBanManager from "./UserBanManager";
import UserBalanceManager from "./UserBalanceManager";
import AnnouncementManager from "./AnnouncementManager";
import PromoCodeManager from "./PromoCodeManager";

const OwnerPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("balance");
  const { getTranslation } = useShop();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{getTranslation("ownerPanel")}</h2>
      
      <Tabs defaultValue="balance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 overflow-x-auto">
          <TabsTrigger value="balance">{getTranslation("wallet")}</TabsTrigger>
          <TabsTrigger value="ban">{getTranslation("users")}</TabsTrigger>
          <TabsTrigger value="announcements">{getTranslation("announcements")}</TabsTrigger>
          <TabsTrigger value="promocodes">{getTranslation("promocodesManager")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="balance">
          <UserBalanceManager />
        </TabsContent>
        
        <TabsContent value="ban">
          <UserBanManager />
        </TabsContent>
        
        <TabsContent value="announcements">
          <AnnouncementManager />
        </TabsContent>
        
        <TabsContent value="promocodes">
          <PromoCodeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerPanel;
