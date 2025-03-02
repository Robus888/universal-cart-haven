import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { 
  Currency, 
  Language, 
  User, 
  ShopContextType,
  Announcement,
  AnnouncementAudience,
  Product
} from "@/types/shop";
import { sampleProducts } from "@/data/sampleProducts";
import { 
  login, 
  logout, 
  register, 
  fetchUserProfile 
} from "@/services/authService";
import { 
  calculateCartTotal, 
  processCartPayment, 
  purchaseProduct 
} from "@/services/cartService";
import { 
  filterProductsByCategory, 
  filterProductsBySearch, 
  getDownloadLink, 
  viewProductDetails 
} from "@/services/productService";
import { useTheme } from "@/hooks/useTheme";

// Re-export the Product type for components to use
export type { Product } from "@/types/shop";

// Extend the ShopContextType to include refreshUserData
interface ExtendedShopContextType extends ShopContextType {
  refreshUserData: () => Promise<void>;
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [language, setLanguageState] = useState<Language>("English");
  const [cart, setCart] = useState<Product[]>([]);
  const [searchQuery, setSearchQueryState] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Load purchased products from localStorage
  useEffect(() => {
    const savedPurchases = localStorage.getItem("purchasedProducts");
    if (savedPurchases) {
      setPurchasedProducts(JSON.parse(savedPurchases));
    }
  }, []);

  // Save purchased products to localStorage
  useEffect(() => {
    if (purchasedProducts.length > 0) {
      localStorage.setItem("purchasedProducts", JSON.stringify(purchasedProducts));
    }
  }, [purchasedProducts]);

  // Function to refresh user data from Supabase
  const refreshUserData = async () => {
    try {
      if (user) {
        const profile = await fetchUserProfile(user.id);
        if (profile) {
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        }
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  // Check for active Supabase session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            await refreshUserData();
          }
        }
        
        setAuthChecked(true);
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthChecked(true);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (event === "SIGNED_IN" && session) {
          await refreshUserData();
          
          // If user is on login page, redirect to home
          if (window.location.pathname === "/login" || window.location.pathname === "/register") {
            navigate("/");
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("user");
          
          // If user is on a protected page, redirect to login
          if (window.location.pathname === "/wallet" || window.location.pathname === "/downloads") {
            navigate("/login");
          }
        }
      }
    );
    
    // Set up interval to periodically refresh user data (every 30 seconds)
    const refreshInterval = setInterval(() => {
      if (user) {
        refreshUserData();
      }
    }, 30000);
    
    return () => {
      authListener?.subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [navigate, user]);

  // Restore user from localStorage on page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && !user) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Also refresh from database to ensure we have the most up-to-date info
      if (parsedUser.id) {
        refreshUserData();
      }
    }
  }, [user]);

  const isAuthenticated = !!user;

  const handleLogin = async (email: string, password: string) => {
    try {
      const userProfile = await login(email, password);
      if (userProfile) {
        setUser(userProfile);
        navigate("/");
      }
    } catch (error) {
      // Error is already handled in the login function
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const success = await register(username, email, password);
      if (success) {
        navigate("/login");
      }
    } catch (error) {
      // Error is already handled in the register function
    }
  };

  // Check if a product is already in the cart
  const isInCart = (productId: string) => {
    return cart.some(item => item.id === productId);
  };

  const addToCart = (product: Product) => {
    // Check if product is already in cart
    if (isInCart(product.id)) {
      toast({
        title: "Already in cart",
        description: `${product.name} is already in your cart.`,
      });
      return;
    }
    
    setCart((prevCart) => [...prevCart, product]);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      return newCart;
    });
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleProcessCartPayment = async (): Promise<boolean> => {
    if (!user) {
      navigate("/login");
      return false;
    }
    
    try {
      const success = await processCartPayment(
        user, 
        cart, 
        clearCart,
        (updatedUser) => {
          setUser(updatedUser);
          refreshUserData(); // Also refresh from DB
        }
      );
      
      if (success) {
        // Add to purchased products
        const productIds = cart.map(item => item.id);
        setPurchasedProducts(prev => [...new Set([...prev, ...productIds])]);
      }
      
      return success;
    } catch (error) {
      console.error("Process cart payment error:", error);
      return false;
    }
  };

  const handlePurchaseProduct = async (product: Product): Promise<boolean> => {
    if (!user) {
      navigate("/login");
      return false;
    }
    
    try {
      const success = await purchaseProduct(
        product, 
        user, 
        (updatedUser) => {
          setUser(updatedUser);
          refreshUserData(); // Also refresh from DB
        }
      );
      
      if (success) {
        // Add to purchased products
        setPurchasedProducts(prev => [...new Set([...prev, product.id])]);
      }
      
      return success;
    } catch (error) {
      console.error("Purchase product error:", error);
      return false;
    }
  };

  const getPurchasedProducts = () => {
    return purchasedProducts;
  };

  const isProductPurchased = (productId: string) => {
    return purchasedProducts.includes(productId);
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    toast({
      title: "Currency updated",
      description: `Currency has been changed to ${newCurrency}`,
    });
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    toast({
      title: "Language updated",
      description: `Language has been changed to ${newLanguage}`,
    });
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    const filtered = filterProductsBySearch(products, query);
    setFilteredProducts(filtered);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const filterProducts = (category?: string) => {
    const filtered = filterProductsByCategory(products, category);
    setFilteredProducts(filtered);
  };

  const contextValue: ExtendedShopContextType = {
    user,
    products,
    filteredProducts,
    currency,
    language,
    cart,
    searchQuery,
    isDarkMode,
    sidebarOpen,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    addToCart,
    removeFromCart,
    setCurrency,
    setLanguage,
    setSearchQuery,
    toggleTheme,
    toggleSidebar,
    filterProducts,
    purchaseProduct: handlePurchaseProduct,
    viewProductDetails,
    clearCart,
    getDownloadLink: (productId) => getDownloadLink(products, productId),
    calculateCartTotal: () => calculateCartTotal(cart),
    processCartPayment: handleProcessCartPayment,
    getPurchasedProducts,
    isProductPurchased,
    isInCart,
    refreshUserData,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

const ShopContext = createContext<ExtendedShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
