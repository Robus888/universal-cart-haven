
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
  fetchUserProfile,
  changeUsername as changeUserUsername,
  changePassword as changeUserPassword,
  redeemPromoCode as redeemUserPromoCode
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
import { useTheme as useNextTheme } from "next-themes";
import { translations } from "@/i18n/translations";

// Re-export the Product type for components to use
export type { Product } from "@/types/shop";

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
  const { theme, setTheme } = useNextTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "English" || savedLanguage === "Spanish")) {
      setLanguageState(savedLanguage);
    }
  }, []);

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
  const refreshUserData = async (userId: string) => {
    try {
      const profile = await fetchUserProfile(userId);
      if (profile) {
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
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
            await refreshUserData(userData.user.id);
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
          await refreshUserData(session.user.id);
          
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
        refreshUserData(user.id);
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
        refreshUserData(parsedUser.id);
      }
    }
  }, [user]);

  const isAuthenticated = !!user;

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    try {
      const userProfile = await login(usernameOrEmail, password);
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
          refreshUserData(updatedUser.id); // Also refresh from DB
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
          refreshUserData(updatedUser.id); // Also refresh from DB
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
    localStorage.setItem("language", newLanguage);
    toast({
      title: getTranslation("languageUpdated"),
      description: getTranslation("languageChangedTo").replace("{language}", newLanguage),
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

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const filterProducts = (category?: string) => {
    const filtered = filterProductsByCategory(products, category);
    setFilteredProducts(filtered);
  };

  const handleChangeUsername = async (newUsername: string): Promise<boolean> => {
    if (!user) {
      navigate("/login");
      return false;
    }
    
    try {
      const success = await changeUserUsername(user.id, newUsername);
      if (success) {
        // Update the local user state
        setUser(prev => prev ? {...prev, username: newUsername} : null);
        // Also refresh from database to ensure we have the most up-to-date info
        refreshUserData(user.id);
      }
      return success;
    } catch (error) {
      console.error("Change username error:", error);
      return false;
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      return await changeUserPassword(currentPassword, newPassword);
    } catch (error) {
      console.error("Change password error:", error);
      return false;
    }
  };

  const handleRedeemPromoCode = async (code: string): Promise<boolean> => {
    if (!user) {
      navigate("/login");
      return false;
    }
    
    try {
      const success = await redeemUserPromoCode(user.id, code);
      if (success) {
        // Refresh user data to get updated balance
        refreshUserData(user.id);
      }
      return success;
    } catch (error) {
      console.error("Redeem promo code error:", error);
      return false;
    }
  };

  const getTranslation = (key: string): string => {
    if (!translations[language] || !translations[language][key]) {
      // Fallback to English if translation is missing
      return translations.English[key] || key;
    }
    return translations[language][key];
  };

  const contextValue: ShopContextType = {
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
    changeUsername: handleChangeUsername,
    changePassword: handleChangePassword,
    redeemPromoCode: handleRedeemPromoCode,
    getTranslation,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
