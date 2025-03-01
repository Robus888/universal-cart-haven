import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export type Currency = "USD" | "EUR" | "GBP";
export type Language = "English" | "Spanish" | "French";

export type User = {
  id: string;
  username: string;
  email: string;
  balance: number;
  is_admin?: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description: string;
  features: string[];
  stock: number;
  image: string;
  category: string;
  downloadLink?: string;
};

type ShopContextType = {
  user: User | null;
  products: Product[];
  filteredProducts: Product[];
  currency: Currency;
  language: Language;
  cart: Product[];
  searchQuery: string;
  isDarkMode: boolean;
  sidebarOpen: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  filterProducts: (category?: string) => void;
  purchaseProduct: (product: Product) => Promise<boolean>;
  viewProductDetails: (productId: string) => void;
  clearCart: () => void;
  getDownloadLink: (productId: string) => string;
  calculateCartTotal: () => number;
  processCartPayment: () => Promise<boolean>;
  getPurchasedProducts: () => string[];
  isProductPurchased: (productId: string) => boolean;
};

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Pro Gaming Headset",
    price: 99.99,
    discountedPrice: 79.99,
    description: "Professional gaming headset with noise cancellation and surround sound",
    features: [
      "Noise cancellation",
      "7.1 surround sound",
      "Adjustable microphone",
      "RGB lighting"
    ],
    stock: 15,
    image: "/lovable-uploads/af231cf1-f65f-4947-a1cb-fe4328f1d729.png",
    category: "Accessories",
    downloadLink: "https://mediafire2.com"
  },
  {
    id: "2",
    name: "Gaming Software Pro",
    price: 69.99,
    description: "Advanced gaming software with performance boosting features",
    features: [
      "ESP + Aimbot",
      "Performance optimization",
      "Auto-update system",
      "24/7 support"
    ],
    stock: 999,
    image: "/lovable-uploads/0292aa96-0ccd-4512-a886-ae373d37eeb8.png",
    category: "Software",
    downloadLink: "https://mediafire5.com"
  },
  {
    id: "3",
    name: "Premium Game Key",
    price: 59.99,
    description: "Premium activation key for the latest games",
    features: [
      "Instant delivery",
      "Global activation",
      "Lifetime warranty",
      "24/7 support"
    ],
    stock: 50,
    image: "/lovable-uploads/11233299-435c-4846-9a4b-9f7787856305.png",
    category: "Keys",
    downloadLink: "https://yowx33.com"
  }
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [language, setLanguageState] = useState<Language>("English");
  const [cart, setCart] = useState<Product[]>([]);
  const [searchQuery, setSearchQueryState] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update HTML class when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

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

  // Check for active Supabase session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            await fetchUserProfile(userData.user.id);
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
          await fetchUserProfile(session.user.id);
          
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
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Save user in localStorage for persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Restore user from localStorage on page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
    }
  }, [user]);
  
  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }
      
      if (data) {
        const userData = {
          id: data.id,
          username: data.username || 'User',
          email: data.email || '',
          balance: Number(data.balance) || 0,
          is_admin: !!data.is_admin
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
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
              is_admin: false
            });
            
          if (insertError) {
            console.error("Error creating user profile:", insertError);
            return;
          }
          
          // Fetch the newly created profile
          const { data: newProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();
            
          if (newProfile) {
            const userData = {
              id: newProfile.id,
              username: newProfile.username || 'User',
              email: newProfile.email || '',
              balance: Number(newProfile.balance) || 0,
              is_admin: !!newProfile.is_admin
            };
            
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.user) {
        await fetchUserProfile(data.user.id);
        
        toast({
          title: "Successfully logged in",
          description: `Welcome back, ${data.user.user_metadata.username || data.user.email?.split('@')[0] || 'user'}!`,
        });
        
        navigate("/");
        return;
      }
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

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      localStorage.removeItem("user");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      if (!username || !email || !password) {
        throw new Error("Please fill in all fields");
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
        
        // Don't auto-login, redirect to login page instead
        navigate("/login");
        return;
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

  const addToCart = (product: Product) => {
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

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.discountedPrice || item.price);
    }, 0);
  };

  const processCartPayment = async (): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to purchase these items",
      });
      navigate("/login");
      return false;
    }

    const total = calculateCartTotal();
    if (user.balance < total) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: (
          <div>
            <p>You don't have enough balance to purchase these items</p>
            <a 
              href="https://t.me/yowxios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 font-semibold hover:underline"
            >
              Buy coins now
            </a>
          </div>
        ),
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
      setUser({
        ...user,
        balance: newBalance
      });
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify({
        ...user,
        balance: newBalance
      }));
      
      // Add to purchased products
      const productIds = cart.map(item => item.id);
      setPurchasedProducts(prev => [...new Set([...prev, ...productIds])]);
      
      toast({
        title: "Purchase successful",
        description: `You have successfully purchased ${cart.length} item(s)`,
      });
      
      // Clear the cart
      clearCart();
      
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
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const filterProducts = (category?: string) => {
    if (!category) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  const getDownloadLink = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.downloadLink || "#";
  };

  const purchaseProduct = async (product: Product): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to purchase this product",
      });
      navigate("/login");
      return false;
    }

    const price = product.discountedPrice || product.price;
    if (user.balance < price) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: (
          <div>
            <p>You don't have enough balance to purchase this product</p>
            <a 
              href="https://t.me/yowxios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 font-semibold hover:underline"
            >
              Buy coins now
            </a>
          </div>
        ),
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
      setUser({
        ...user,
        balance: newBalance
      });
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify({
        ...user,
        balance: newBalance
      }));
      
      // Add to purchased products
      setPurchasedProducts(prev => [...prev, product.id]);
      
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

  const viewProductDetails = (productId: string) => {
    window.open("https://t.me/yowxios", "_blank");
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
    login,
    logout,
    register,
    addToCart,
    removeFromCart,
    setCurrency,
    setLanguage,
    setSearchQuery,
    toggleTheme,
    toggleSidebar,
    filterProducts,
    purchaseProduct,
    viewProductDetails,
    clearCart,
    getDownloadLink,
    calculateCartTotal,
    processCartPayment,
    getPurchasedProducts,
    isProductPurchased,
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
