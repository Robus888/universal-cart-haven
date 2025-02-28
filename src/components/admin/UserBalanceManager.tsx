
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  email: string;
  balance: number;
}

const UserBalanceManager: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("username");

      if (error) throw error;

      setUsers(data || []);
      setFilteredUsers(data || []);
      
      // Initialize newBalances with current values
      const balances: Record<string, string> = {};
      data?.forEach(user => {
        balances[user.id] = user.balance.toString();
      });
      setNewBalances(balances);
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

  const handleBalanceChange = (userId: string, value: string) => {
    setNewBalances({
      ...newBalances,
      [userId]: value,
    });
  };

  const updateBalance = async (userId: string) => {
    try {
      const newBalance = parseFloat(newBalances[userId]);
      
      if (isNaN(newBalance)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid number",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User balance updated successfully",
      });

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, balance: newBalance } : user
        )
      );
    } catch (error) {
      console.error("Error updating balance:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update balance",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage User Balances</CardTitle>
        <CardDescription>Update user account balances</CardDescription>
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
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Input
                    type="number"
                    value={newBalances[user.id] || ""}
                    onChange={(e) => handleBalanceChange(user.id, e.target.value)}
                    className="w-32"
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
