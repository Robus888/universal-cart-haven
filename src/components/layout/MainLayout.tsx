
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useShop } from "@/contexts/ShopContext";
import Announcement from "@/components/Announcement";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarOpen } = useShop();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        <Navbar />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      <Announcement />
    </div>
  );
};

export default MainLayout;
