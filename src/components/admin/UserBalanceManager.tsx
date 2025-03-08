
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, RefreshCw, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  username: string;
  email: string;
  balance: number;
  is_admin?: boolean;
  is_owner?: boolean;
}

const UserBalanceManager: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // New balance amount to set
  const [newBalances, setNewBalances] = useState<Record<string, string>>({});

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
      setError(null);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("username");

      if (error) throw error;

      // Type checking to ensure data is an array
      const userProfiles = Array.isArray(data) ? data : [];
      
      setUsers(userProfiles);
      setFilteredUsers(userProfiles);
      
      // Initialize newBalances with current values
      const balances: Record<string, string> = {};
      userProfiles.forEach(user => {
        balances[user.id] = user.balance?.toString() || "0";
      });
      setNewBalances(balances);
      
      console.log("Fetched users:", userProfiles);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBalanceChange = (userId: string, value: string) => {
    // Ensure value is a valid number or empty string
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setNewBalances({
        ...newBalances,
        [userId]: value,
      });
    }
  };

  const updateBalance = async (userId: string) => {
    try {
      const newBalanceStr = newBalances[userId] || "0";
      const newBalance = parseFloat(newBalanceStr);
      
      if (isNaN(newBalance)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid number",
        });
        return;
      }

      // Update the balance in Supabase
      const { error, data } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", userId)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "User balance updated successfully",
      });

      console.log("Updated balance:", data);

      // Update local state with the response from Supabase
      if (data && data.length > 0) {
        setUsers(prevUsers =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, balance: data[0].balance } : user
          )
        );
        
        // Update filtered users as well
        setFilteredUsers(prevFiltered =>
          prevFiltered.map((user) =>
            user.id === userId ? { ...user, balance: data[0].balance } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update balance",
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

  const getRoleBadge = (user: Profile) => {
    if (user.is_owner) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Owner</Badge>;
    } else if (user.is_admin) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Admin</Badge>;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manage User Balances</CardTitle>
            <CardDescription>Update user account balances</CardDescription>
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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            <p className="font-medium">{error}</p>
            <Button variant="outline" onClick={fetchUsers} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-4">No users found</div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md"
              >
                <div className="mb-2 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.username || 'No username'}</p>
                    {getRoleBadge(user)}
                  </div>
                  <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                  <p className="text-xs text-gray-500">Current balance: ${user.balance?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Input
                    type="text"
                    value={newBalances[user.id] || ""}
                    onChange={(e) => handleBalanceChange(user.id, e.target.value)}
                    className="w-32"
                    placeholder="0.00"
                  />
                  <Button onClick={() => updateBalance(user.id)}>Update</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBalanceManager;
