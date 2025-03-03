
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useShop } from "@/contexts/ShopContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AnnouncementAudience, Announcement } from "@/types/shop";
import { User, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AnnouncementManager: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("all");
  const [targetUser, setTargetUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<{ id: string, username: string, email: string }[]>([]);
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const { user } = useShop();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchActiveAnnouncements();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email")
        .order("username");

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
    }
  };

  const fetchActiveAnnouncements = async () => {
    try {
      setIsLoadingAnnouncements(true);
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map data to Announcement type with correct audience type
      const typedAnnouncements: Announcement[] = (data || []).map(item => ({
        ...item,
        audience: (item.audience === "all" || item.audience === "specific") 
          ? item.audience as AnnouncementAudience 
          : "all"
      }));
      
      setActiveAnnouncements(typedAnnouncements);
    } catch (error) {
      console.error("Error fetching active announcements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load active announcements",
      });
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both title and message fields",
      });
      return;
    }

    // Check if there's already an active announcement
    if (activeAnnouncements.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please delete existing announcement before creating a new one",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("announcements")
        .insert({
          title,
          message,
          created_by: user?.id,
          active: true,
          audience,
          target_user_id: audience === "specific" ? targetUser : null
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
      
      // Reset form
      setTitle("");
      setMessage("");
      setAudience("all");
      setTargetUser("");
      
      // Refresh active announcements
      fetchActiveAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create announcement",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      setIsDeleting(prev => ({ ...prev, [id]: true }));
      
      const { error } = await supabase
        .from("announcements")
        .update({ active: false })
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
      
      // Remove from local state
      setActiveAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete announcement",
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const refreshAnnouncements = () => {
    fetchActiveAnnouncements();
  };
  
  const getUsernameById = (userId: string | null | undefined) => {
    if (!userId) return "All users";
    const user = users.find(u => u.id === userId);
    return user ? (user.username || user.email) : "Unknown user";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Announcement</CardTitle>
        <CardDescription>Create a new announcement for all users or a specific user</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter announcement message"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="audience" className="text-sm font-medium">
              Audience
            </label>
            <Select
              value={audience}
              onValueChange={(value: AnnouncementAudience) => setAudience(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="specific">Specific User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {audience === "specific" && (
            <div className="space-y-2">
              <label htmlFor="targetUser" className="text-sm font-medium">
                Target User
              </label>
              <Select
                value={targetUser}
                onValueChange={setTargetUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting || activeAnnouncements.length > 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Announcement"
            )}
          </Button>
          
          {activeAnnouncements.length > 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              Please delete the existing announcement before creating a new one.
            </p>
          )}
        </form>
      </CardContent>
      
      <Separator className="my-4" />
      
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle>Active Announcements</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshAnnouncements}
            disabled={isLoadingAnnouncements}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingAnnouncements ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoadingAnnouncements ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading announcements...</span>
          </div>
        ) : activeAnnouncements.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No active announcements</p>
        ) : (
          <div className="space-y-4">
            {activeAnnouncements.map((announcement) => (
              <div key={announcement.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      For: {announcement.audience === "all" 
                        ? "All users" 
                        : `Specific user: ${getUsernameById(announcement.target_user_id)}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(announcement.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    disabled={isDeleting[announcement.id]}
                  >
                    {isDeleting[announcement.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {announcement.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementManager;
