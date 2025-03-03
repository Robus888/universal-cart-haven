
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Announcement from "@/components/Announcement";
import { useShop } from "@/contexts/ShopContext";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useShop();
  
  // Close sidebar on clicks outside when on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.getElementById("sidebar-container");
      
      if (window.innerWidth < 1024 && 
          sidebar && 
          !sidebar.contains(target) && 
          !target.closest("[data-sidebar-trigger='true']")) {
        // If click is outside sidebar and not on the trigger
        // And we're on mobile, close the sidebar
        toggleSidebar();
      }
    };
    
    if (sidebarOpen && window.innerWidth < 1024) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, toggleSidebar]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div 
        id="sidebar-container" 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:relative lg:z-0"
        )}
      >
        <Sidebar />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-64" : ""
      )}>
        <Navbar />
        <Announcement />
        <main className="container mx-auto p-4">
          {children}
        </main>
        
        <footer className="border-t border-gray-200 dark:border-gray-800 py-6 px-4 mt-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} YowxMods. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Terms
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Privacy
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
