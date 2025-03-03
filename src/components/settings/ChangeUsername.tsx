
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Info } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const usernameSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
});

type UsernameFormValues = z.infer<typeof usernameSchema>;

const ChangeUsername: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastChanged, setLastChanged] = useState<Date | null>(null);
  const [canChange, setCanChange] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const { toast } = useToast();
  const { user, refreshUserData } = useShop();
  
  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  // Check when the username was last changed
  useEffect(() => {
    const checkLastUsernameChange = async () => {
      if (!user) return;
      
      try {
        // Get the user's last username change date from localStorage
        const lastChangedStr = localStorage.getItem(`username_last_changed_${user.id}`);
        
        if (lastChangedStr) {
          const lastChangedDate = new Date(lastChangedStr);
          setLastChanged(lastChangedDate);
          
          // Check if a week has passed
          const now = new Date();
          const weekInMs = 7 * 24 * 60 * 60 * 1000;
          const canChangeNow = (now.getTime() - lastChangedDate.getTime()) >= weekInMs;
          
          setCanChange(canChangeNow);
          
          if (!canChangeNow) {
            // Calculate and display time remaining
            updateTimeRemaining(lastChangedDate);
            const interval = setInterval(() => {
              updateTimeRemaining(lastChangedDate);
            }, 60000); // Update every minute
            
            return () => clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Error checking last username change:", error);
      }
    };
    
    checkLastUsernameChange();
  }, [user]);

  const updateTimeRemaining = (lastChangedDate: Date) => {
    const now = new Date();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const nextChangeDate = new Date(lastChangedDate.getTime() + weekInMs);
    
    if (now >= nextChangeDate) {
      setCanChange(true);
      setTimeRemaining("");
      return;
    }
    
    const remainingMs = nextChangeDate.getTime() - now.getTime();
    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    setTimeRemaining(`${days} days and ${hours} hours`);
  };

  const onSubmit = async (values: UsernameFormValues) => {
    if (!canChange) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `You can only change your username once per week. Please wait ${timeRemaining}.`,
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to change your username",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if username is already taken
      const { data: existingUsers, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", values.username)
        .neq("id", user.id);
      
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Username is already taken");
      }
      
      // Update the username
      const { error } = await supabase
        .from("profiles")
        .update({ username: values.username })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update the last changed date
      const now = new Date();
      localStorage.setItem(`username_last_changed_${user.id}`, now.toISOString());
      setLastChanged(now);
      setCanChange(false);
      
      // Update time remaining
      updateTimeRemaining(now);
      
      // Refresh user data
      if (refreshUserData) {
        refreshUserData();
      }
      
      toast({
        title: "Success",
        description: "Your username has been updated",
      });
    } catch (error: any) {
      console.error("Error changing username:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to change username",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Username</CardTitle>
        <CardDescription>Update your display name (allowed once per week)</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your new username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting || !canChange}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Username"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      {!canChange && timeRemaining && (
        <CardFooter className="border-t pt-6">
          <div className="flex items-start space-x-2 text-amber-600 dark:text-amber-400">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              You can change your username again in {timeRemaining}. Username changes are limited to once per week.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ChangeUsername;
