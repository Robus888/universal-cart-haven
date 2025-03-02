
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, RefreshCw, Ban, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  username: string;
  email: string;
  banned: boolean;
}

const UserBanManager: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, banned")
        .order("username");

      if (error) throw error;

      // Type checking to ensure data is an array
      const userProfiles = Array.isArray(data) ? data.map(profile => ({
        ...profile,
        banned: !!profile.banned // Ensure banned is a boolean
      })) : [];
      
      setUsers(userProfiles);
      setFilteredUsers(userProfiles);
      
      console.log("Fetched users:", userProfiles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserBan = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from("profiles")
        .update({ banned: newStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${newStatus ? 'banned' : 'unbanned'} successfully`,
      });

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: newStatus } : user
        )
      );
      
      // Update filtered users as well
      setFilteredUsers(prevFiltered =>
        prevFiltered.map((user) =>
          user.id === userId ? { ...user, banned: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating ban status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user ban status",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "User list has been refreshed",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Ban Users</CardTitle>
            <CardDescription>Manage user access to the platform</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search users by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-4">No users found</div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 border rounded-md"
              >
                <div>
                  <div className="flex items-center">
                    {user.banned ? 
                      <Ban className="h-4 w-4 text-red-500 mr-2" /> : 
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                    }
                    <p className="font-medium">{user.username || 'No username'}</p>
                  </div>
                  <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`ban-${user.id}`}
                    checked={user.banned}
                    onCheckedChange={() => toggleUserBan(user.id, user.banned)}
                  />
                  <Label htmlFor={`ban-${user.id}`} className="text-sm">
                    {user.banned ? 'Banned' : 'Active'}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBanManager;
