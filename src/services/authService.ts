
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/shop";
import { toast } from "@/components/ui/use-toast";

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    if (data) {
      // Check if user is banned
      if (data.banned) {
        toast({
          variant: "destructive",
          title: "Account Banned",
          description: "Your account has been banned. Please contact support for assistance.",
        });
        await supabase.auth.signOut();
        return null;
      }
      
      const userData: User = {
        id: data.id,
        username: data.username || 'User',
        email: data.email || '',
        balance: Number(data.balance) || 0,
        is_admin: !!data.is_admin,
        is_owner: !!data.is_owner,
        banned: !!data.banned
      };
      
      return userData;
    } else {
      // Profile doesn't exist yet, create it
      const { data: authData } = await supabase.auth.getUser();
      
      if (authData && authData.user) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            username: authData.user.user_metadata.username || authData.user.email?.split('@')[0] || 'User',
            email: authData.user.email,
            balance: 0,
            is_admin: false,
            is_owner: false,
            banned: false
          });
          
        if (insertError) {
          console.error("Error creating user profile:", insertError);
          return null;
        }
        
        // Fetch the newly created profile
        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
          
        if (newProfile) {
          const userData: User = {
            id: newProfile.id,
            username: newProfile.username || 'User',
            email: newProfile.email || '',
            balance: Number(newProfile.balance) || 0,
            is_admin: !!newProfile.is_admin,
            is_owner: !!newProfile.is_owner,
            banned: !!newProfile.banned
          };
          
          return userData;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both email and password",
      });
      return null;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Handle specific error messages for better UX
      if (error.message.includes("Invalid login")) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please check your credentials and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.message || "An error occurred during login",
        });
      }
      console.error("Login error:", error);
      return null;
    }
    
    if (data && data.user) {
      const userProfile = await fetchUserProfile(data.user.id);
      
      if (userProfile) {
        // Check if the user is banned
        if (userProfile.banned) {
          toast({
            variant: "destructive",
            title: "Account Banned",
            description: "Your account has been banned. Please contact support for assistance.",
          });
          await supabase.auth.signOut();
          return null;
        }
        
        toast({
          title: "Successfully logged in",
          description: `Welcome back, ${userProfile.username}!`,
        });
        
        return userProfile;
      }
    }
    
    // If we got here without returning a profile, something went wrong
    toast({
      variant: "destructive",
      title: "Login Error",
      description: "Unable to retrieve your profile. Please try again.",
    });
    return null;
  } catch (error) {
    let message = "Login failed";
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
    
    console.error("Login error:", error);
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to log out. Please try again.",
    });
    return false;
  }
};

export const register = async (username: string, email: string, password: string): Promise<boolean> => {
  try {
    if (!username || !email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return false;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error.message || "Failed to create account",
      });
      console.error("Registration error:", error);
      return false;
    }
    
    if (data.user) {
      toast({
        title: "Account created",
        description: `Welcome, ${username}! Please verify your email if required.`,
      });
      
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Failed to create account. Please try again.",
      });
      return false;
    }
  } catch (error) {
    let message = "Registration failed";
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
    
    console.error("Registration error:", error);
    return false;
  }
};
