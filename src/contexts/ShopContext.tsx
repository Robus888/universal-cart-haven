
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export type Currency = "USD" | "EUR" | "GBP";
export type Language = "English" | "Spanish" | "French";

export type User = {
  id: string;
  username: string;
  email: string;
  balance: number;
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
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

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
  },
  {
    id: "4",
    name: "Performance Optimizer",
    price: 149.99,
    discountedPrice: 119.99,
    description: "Advanced tool for optimizing your gaming performance",
    features: [
      "FPS boost",
      "System optimization",
      "Resource management",
      "Real-time monitoring"
    ],
    stock: 7,
    image: "/lovable-uploads/edd98424-6f2d-41f6-91a0-f0a4eb5849d7.png",
    category: "Software",
  },
  {
    id: "5",
    name: "Gaming Enhancement Pack",
    price: 129.99,
    discountedPrice: 99.99,
    description: "Complete package of gaming enhancements and boosters",
    features: [
      "Multiple profiles",
      "Cloud synchronization",
      "Anti-detection system",
      "Premium support"
    ],
    stock: 12,
    image: "/lovable-uploads/2ca62e6d-f7a6-4e54-b7f9-e31914fb6efe.png",
    category: "Bundles",
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

  // Check for saved user data
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      // Simulating API call
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }
      
      // For demo purposes, let's use a mock user
      const mockUser: User = {
        id: "1",
        username: email.split("@")[0],
        email,
        balance: 100.00,
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "Successfully logged in",
        description: `Welcome back, ${mockUser.username}!`,
      });
      
      navigate("/");
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Simulating API call
      if (!username || !email || !password) {
        throw new Error("Please fill in all fields");
      }
      
      // For demo purposes, create a new mock user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
        balance: 0,
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Account created",
        description: `Welcome, ${username}!`,
      });
      
      navigate("/");
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
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
