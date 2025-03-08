
import { supabase } from "@/integrations/supabase/client";
import { User, PromoCode } from "@/types/shop";
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
      
      // Get IP address for the user
      let ipAddress = "181.224.230.187"; // Default IP as a fallback
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const ipData = await response.json();
        if (ipData && ipData.ip) {
          ipAddress = ipData.ip;
        }
      } catch (ipError) {
        console.error("Error fetching IP:", ipError);
      }
      
      // Detect OS
      const userAgent = navigator.userAgent;
      let os = "Unknown";
      if (userAgent.indexOf("Win") !== -1) os = "Windows";
      else if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
      else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
      else if (userAgent.indexOf("Android") !== -1) os = "Android";
      else if (userAgent.indexOf("iOS") !== -1) os = "iOS";
      
      const userData: User = {
        id: data.id,
        username: data.username || 'User',
        email: data.email || '',
        balance: Number(data.balance) || 0,
        is_admin: !!data.is_admin,
        is_owner: !!data.is_owner,
        banned: !!data.banned,
        last_username_change: data.last_username_change || null,
        ip_address: ipAddress,
        os: os,
        join_date: data.created_at || new Date().toISOString(),
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
            banned: false,
            last_username_change: new Date().toISOString(),
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
          // Get IP address for the user
          let ipAddress = "181.224.230.187"; // Default IP as a fallback
          try {
            const response = await fetch('https://api.ipify.org?format=json');
            const ipData = await response.json();
            if (ipData && ipData.ip) {
              ipAddress = ipData.ip;
            }
          } catch (ipError) {
            console.error("Error fetching IP:", ipError);
          }
          
          // Detect OS
          const userAgent = navigator.userAgent;
          let os = "Unknown";
          if (userAgent.indexOf("Win") !== -1) os = "Windows";
          else if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
          else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
          else if (userAgent.indexOf("Android") !== -1) os = "Android";
          else if (userAgent.indexOf("iOS") !== -1) os = "iOS";
          
          const userData: User = {
            id: newProfile.id,
            username: newProfile.username || 'User',
            email: newProfile.email || '',
            balance: Number(newProfile.balance) || 0,
            is_admin: !!newProfile.is_admin,
            is_owner: !!newProfile.is_owner,
            banned: !!newProfile.banned,
            last_username_change: newProfile.last_username_change || null,
            ip_address: ipAddress,
            os: os,
            join_date: newProfile.created_at || new Date().toISOString(),
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

export const login = async (usernameOrEmail: string, password: string): Promise<User | null> => {
  try {
    if (!usernameOrEmail || !password) {
      throw new Error("Please enter both username/email and password");
    }
    
    // First try email login
    let authResponse;
    
    // Check if input is an email (contains @ symbol)
    if (usernameOrEmail.includes('@')) {
      authResponse = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password,
      });
    } else {
      // If not an email, look up the user by username to get their email
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", usernameOrEmail)
        .maybeSingle();
        
      if (profileError || !profileData || !profileData.email) {
        throw new Error("Username not found");
      }
      
      // Now sign in with the email
      authResponse = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password,
      });
    }
    
    const { data, error } = authResponse;
    
    if (error) {
      throw error;
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
    
    throw error;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Clear any local storage that might have user data
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Redirect to the login page
    window.location.href = "/login";
    
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
      throw new Error("Please fill in all fields");
    }
    
    // Check if username is already taken
    const { data: existingUser, error: userCheckError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();
      
    if (userCheckError) {
      console.error("Error checking existing username:", userCheckError);
      throw new Error("Error checking username availability");
    }
    
    if (existingUser) {
      throw new Error("Username is already taken");
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
      throw error;
    }
    
    if (data.user) {
      toast({
        title: "Account created",
        description: `Welcome, ${username}! Please verify your email if required.`,
      });
      
      return true;
    } else {
      throw new Error("Failed to create account. Please try again.");
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
    
    throw error;
  }
};

export const changeUsername = async (userId: string, newUsername: string): Promise<boolean> => {
  try {
    // Check if username is available
    const { data: existingUser, error: userCheckError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", newUsername)
      .neq("id", userId)
      .maybeSingle();
      
    if (userCheckError) {
      console.error("Error checking existing username:", userCheckError);
      throw new Error("Error checking username availability");
    }
    
    if (existingUser) {
      throw new Error("Username is already taken");
    }
    
    // Get user's current data to check last_username_change
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("last_username_change")
      .eq("id", userId)
      .maybeSingle();
      
    if (profileError) {
      throw new Error("Error fetching user profile");
    }
    
    if (!userProfile) {
      throw new Error("User profile not found");
    }
    
    // Check if user can change their username (once per month)
    const lastChange = userProfile.last_username_change ? new Date(userProfile.last_username_change) : null;
    const now = new Date();
    
    if (lastChange) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      if (lastChange > oneMonthAgo) {
        throw new Error("You can only change your username once every 30 days");
      }
    }
    
    // Update username
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        username: newUsername,
        last_username_change: now.toISOString(),
      })
      .eq("id", userId);
      
    if (updateError) {
      throw updateError;
    }
    
    toast({
      title: "Username updated",
      description: `Your username has been changed to ${newUsername}`,
    });
    
    return true;
  } catch (error) {
    let message = "Failed to change username";
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
    
    return false;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    // Verify the current user session first
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error("You must be logged in to change your password");
    }
    
    // Update the password
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated",
    });
    
    return true;
  } catch (error) {
    let message = "Failed to change password";
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
    
    return false;
  }
};

export const redeemPromoCode = async (userId: string, code: string): Promise<boolean> => {
  try {
    // Get the promo code from the database
    const { data: promoData, error: promoError } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();
      
    if (promoError) {
      throw new Error("Error checking promo code");
    }
    
    if (!promoData) {
      throw new Error("Invalid or expired promo code");
    }
    
    // Check if the promo code has reached its redemption limit
    if (promoData.max_redemptions > 0 && promoData.current_redemptions >= promoData.max_redemptions) {
      // Update the promo code to inactive since it reached the max redemptions
      await supabase
        .from("promo_codes")
        .update({ active: false })
        .eq("id", promoData.id);
        
      throw new Error("This promo code has reached its maximum redemptions");
    }
    
    // Check if user has already redeemed this code
    const { data: existingRedemption, error: redemptionError } = await supabase
      .from("promo_redemptions")
      .select("id")
      .eq("user_id", userId)
      .eq("promo_code_id", promoData.id)
      .maybeSingle();
      
    if (redemptionError) {
      throw new Error("Error checking redemption history");
    }
    
    if (existingRedemption) {
      throw new Error("You have already redeemed this promo code");
    }
    
    // Start a transaction to update everything
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .maybeSingle();
      
    if (userError || !userData) {
      throw new Error("Error fetching user data");
    }
    
    // Update user balance
    const newBalance = Number(userData.balance) + Number(promoData.amount);
    
    const { error: updateUserError } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", userId);
      
    if (updateUserError) {
      throw new Error("Error updating balance");
    }
    
    // Record the redemption
    const { error: redemptionInsertError } = await supabase
      .from("promo_redemptions")
      .insert({
        user_id: userId,
        promo_code_id: promoData.id,
        amount: promoData.amount,
      });
      
    if (redemptionInsertError) {
      throw new Error("Error recording redemption");
    }
    
    // Increment the redemption counter
    const { error: updatePromoError } = await supabase
      .from("promo_codes")
      .update({ 
        current_redemptions: promoData.current_redemptions + 1,
        active: promoData.max_redemptions > 0 && promoData.current_redemptions + 1 >= promoData.max_redemptions ? false : true
      })
      .eq("id", promoData.id);
      
    if (updatePromoError) {
      throw new Error("Error updating promo code");
    }
    
    toast({
      title: "Promo code redeemed!",
      description: `${promoData.amount} has been added to your balance`,
    });
    
    return true;
  } catch (error) {
    let message = "Failed to redeem promo code";
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
    
    return false;
  }
};
