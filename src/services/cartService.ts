
import { supabase } from "@/integrations/supabase/client";
import { Product, User } from "@/types/shop";
import { toast } from "@/components/ui/use-toast";

export const calculateCartTotal = (cart: Product[]): number => {
  return cart.reduce((total, item) => {
    return total + (item.discountedPrice || item.price);
  }, 0);
};

export const processCartPayment = async (
  user: User,
  cart: Product[],
  onCartCleared: () => void,
  onUserUpdated: (user: User) => void
): Promise<boolean> => {
  if (!user) {
    toast({
      variant: "destructive",
      title: "Authentication required",
      description: "Please log in to purchase these items",
    });
    return false;
  }

  const total = calculateCartTotal(cart);
  if (user.balance < total) {
    toast({
      variant: "destructive",
      title: "Insufficient balance",
      description: "You don't have enough balance to purchase these items",
    });
    return false;
  }

  try {
    console.log("Processing payment with total:", total);
    console.log("Current user balance:", user.balance);
    
    // Update user balance in Supabase
    const newBalance = user.balance - total;
    console.log("New balance will be:", newBalance);
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", user.id);
    
    if (updateError) {
      console.error("Error updating balance:", updateError);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "An error occurred while processing your purchase",
      });
      return false;
    }
    
    // Record all purchases
    const purchasePromises = cart.map(item => {
      return supabase
        .from("purchases")
        .insert({
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          amount: item.discountedPrice || item.price
        });
    });
    
    const results = await Promise.all(purchasePromises);
    
    for (const { error } of results) {
      if (error) {
        console.error("Error recording purchase:", error);
      }
    }
    
    // Update local user state
    const updatedUser = {
      ...user,
      balance: newBalance
    };
    
    onUserUpdated(updatedUser);
    
    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    toast({
      title: "Purchase successful",
      description: `You have successfully purchased ${cart.length} item(s)`,
    });
    
    // Clear the cart
    onCartCleared();
    
    return true;
  } catch (error) {
    console.error("Purchase error:", error);
    toast({
      variant: "destructive",
      title: "Transaction failed",
      description: "An error occurred while processing your purchase",
    });
    return false;
  }
};

export const purchaseProduct = async (
  product: Product,
  user: User,
  onUserUpdated: (user: User) => void
): Promise<boolean> => {
  if (!user) {
    toast({
      variant: "destructive",
      title: "Authentication required",
      description: "Please log in to purchase this product",
    });
    return false;
  }

  const price = product.discountedPrice || product.price;
  if (user.balance < price) {
    toast({
      variant: "destructive",
      title: "Insufficient balance",
      description: "You don't have enough balance to purchase this product",
    });
    return false;
  }

  try {
    // Update user balance in Supabase
    const newBalance = user.balance - price;
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", user.id);
    
    if (updateError) {
      console.error("Error updating balance:", updateError);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "An error occurred while processing your purchase",
      });
      return false;
    }
    
    // Record the purchase
    const { error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        amount: price
      });
    
    if (purchaseError) {
      console.error("Error recording purchase:", purchaseError);
    }
    
    // Update local user state
    const updatedUser = {
      ...user,
      balance: newBalance
    };
    
    onUserUpdated(updatedUser);
    
    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    toast({
      title: "Purchase successful",
      description: `You have successfully purchased ${product.name}`,
    });
    
    // Open the download link in a new tab
    window.open(product.downloadLink || "#", "_blank");
    
    return true;
  } catch (error) {
    console.error("Purchase error:", error);
    toast({
      variant: "destructive",
      title: "Transaction failed",
      description: "An error occurred while processing your purchase",
    });
    return false;
  }
};
