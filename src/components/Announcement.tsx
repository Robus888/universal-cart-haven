
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

const Announcement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestAnnouncement();
  }, []);

  const fetchLatestAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Check if the announcement was dismissed before
        const dismissedAnnouncements = JSON.parse(localStorage.getItem("dismissedAnnouncements") || "[]");
        if (!dismissedAnnouncements.includes(data[0].id)) {
          setAnnouncement(data[0]);
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
        </DialogHeader>
        <div className="py-4">
          <p className="whitespace-pre-wrap">{announcement.message}</p>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <Button variant="secondary" onClick={handleDontShowAgain}>
            No vuelvas a aparecer
          </Button>
          <Button variant="destructive" onClick={handleClose}>
            CERRAR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Announcement;
