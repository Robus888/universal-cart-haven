
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useShop } from "@/contexts/ShopContext";
import { X } from "lucide-react";
import { Announcement as AnnouncementType } from "@/types/shop";

const Announcement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<AnnouncementType | null>(null);
  const { toast } = useToast();
  const { user } = useShop();

  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  const fetchAnnouncements = async () => {
    try {
      // First try to get announcements targeted to this user
      let query = supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (user) {
        // If user is logged in, get announcements for either all users or specifically for this user
        query = query.or(`audience.eq.all,and(audience.eq.specific,target_user_id.eq.${user.id})`);
      } else {
        // If no user is logged in, only get announcements for all users
        query = query.eq("audience", "all");
      }

      const { data, error } = await query.limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Check if the announcement was dismissed before
        const dismissedAnnouncements = JSON.parse(localStorage.getItem("dismissedAnnouncements") || "[]");
        if (!dismissedAnnouncements.includes(data[0].id)) {
          setAnnouncement(data[0] as AnnouncementType);
          setOpen(true);
        }
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load announcements",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDontShowAgain = () => {
    if (announcement) {
      const dismissedAnnouncements = JSON.parse(localStorage.getItem("dismissedAnnouncements") || "[]");
      dismissedAnnouncements.push(announcement.id);
      localStorage.setItem("dismissedAnnouncements", JSON.stringify(dismissedAnnouncements));
    }
    setOpen(false);
  };

  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{announcement.title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="py-4">
          <p className="whitespace-pre-wrap">{announcement.message}</p>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <Button variant="secondary" onClick={handleDontShowAgain}>
            Don't show again
          </Button>
          <Button variant="default" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Announcement;
