
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/contexts/ShopContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Announcement = () => {
  const { user } = useShop();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const fetchAnnouncements = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .or(`audience.eq.all,target_user_id.eq.${user.id}`);
      
      if (error) {
        console.error("Error fetching announcements:", error);
        return;
      }
      
      // Filter out announcements that have been viewed in this session
      const viewedAnnouncementIds = JSON.parse(sessionStorage.getItem('viewedAnnouncements') || '[]');
      const newAnnouncements = data.filter(
        announcement => !viewedAnnouncementIds.includes(announcement.id)
      );
      
      if (newAnnouncements.length > 0) {
        setAnnouncements(newAnnouncements);
        setIsVisible(true);
      }
    } catch (error) {
      console.error("Error in fetchAnnouncements:", error);
    }
  };
  
  useEffect(() => {
    fetchAnnouncements();
    
    // Set up interval to check for new announcements every 5 minutes
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);
  
  const handleDismiss = () => {
    // Store this announcement as viewed in session storage
    const viewedAnnouncementIds = JSON.parse(sessionStorage.getItem('viewedAnnouncements') || '[]');
    viewedAnnouncementIds.push(announcements[currentIndex].id);
    sessionStorage.setItem('viewedAnnouncements', JSON.stringify(viewedAnnouncementIds));
    
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsVisible(false);
      setCurrentIndex(0);
    }
  };
  
  // If no announcements or not visible, don't render anything
  if (!isVisible || announcements.length === 0) return null;
  
  const currentAnnouncement = announcements[currentIndex];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentAnnouncement.title}
                </h3>
                <button 
                  onClick={handleDismiss} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {currentAnnouncement.message}
              </p>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDismiss}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Announcement;
