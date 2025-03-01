
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

export type ShopContextType = {
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
  isInCart: (productId: string) => boolean;
};
