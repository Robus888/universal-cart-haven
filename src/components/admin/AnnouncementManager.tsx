import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AnnouncementAudience } from "@/types/shop";

const AnnouncementManager: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("all");
  const [targetUser, setTargetUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<{ id: string, username: string, email: string }[]>([]);
  const { user } = useShop();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
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
      console.error("❌ Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users.",
      });
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

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from("announcements")
        .insert([
          {
            title,
            message,
            created_by: user?.id, // Ensure user ID is valid
            active: true,
            audience,
            target_user_id: audience === "specific" ? targetUser : null,
            created_at: new Date().toISOString(), // Ensures created_at field is populated
          }
        ])
        .select(); // Fetch inserted data

      console.log("✅ Supabase response:", data);

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
    } catch (error) {
      console.error("❌ Error creating announcement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create announcement",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Announcement</CardTitle>
        <CardDescription>Create a new announcement for all users or a specific user</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
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

          {/* Message Input */}
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

          {/* Audience Selection */}
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

          {/* Target User Selection (Only if Specific User is Chosen) */}
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

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnnouncementManager;
