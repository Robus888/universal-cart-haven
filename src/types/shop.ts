
export type Currency = "USD" | "EUR" | "GBP";
export type Language = "English" | "Spanish" | "Portuguese" | "Vietnamese" | "Russian" | "Arabic";

export type User = {
  id: string;
  username: string;
  email: string;
  balance: number;
  is_admin?: boolean;
  is_owner?: boolean;
  banned?: boolean;
  last_username_change?: string | null;
  ip_address?: string;
  os?: string;
  join_date?: string;
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

export type AnnouncementAudience = "all" | "specific";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  active: boolean;
  audience: AnnouncementAudience;
  target_user_id?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
};

export type PromoCode = {
  id: string;
  code: string;
  amount: number;
  max_redemptions: number;
  current_redemptions: number;
  active: boolean;
  created_at: string;
  created_by: string;
};

export type PromoRedemption = {
  id: string;
  user_id: string;
  promo_code_id: string;
  amount: number;
  created_at: string;
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
  login: (usernameOrEmail: string, password: string) => Promise<void>;
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
  changeUsername: (newUsername: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  redeemPromoCode: (code: string) => Promise<boolean>;
  getTranslation: (key: string) => string;
};
