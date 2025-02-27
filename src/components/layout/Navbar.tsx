
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useShop } from "@/contexts/ShopContext";
import { 
  Menu, 
  Sun, 
  Moon, 
  ShoppingCart, 
  Bell, 
  Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Navbar: React.FC = () => {
  const { 
    toggleSidebar, 
    isDarkMode, 
    toggleTheme, 
    currency, 
    setCurrency, 
    language,
    setLanguage,
    isAuthenticated,
    cart,
    searchQuery,
    setSearchQuery
  } = useShop();
  
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mr-2 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            
            <NavLink to="/" className="flex items-center space-x-2 lg:hidden">
              <div className="h-8 w-8 rounded-full bg-shop-blue flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 7L12 12L4 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-bold hidden sm:inline">GameShop</span>
            </NavLink>
          </div>

          {showSearch ? (
            <div className="flex-1 max-w-md mx-4 relative animate-fade-in">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7" 
                onClick={() => setShowSearch(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <nav className="mx-4 hidden md:flex items-center space-x-4 flex-1 justify-center">
              <NavLink to="/" className="text-sm font-medium transition-colors hover:text-shop-blue">
                Home
              </NavLink>
              <NavLink to="/shop" className="text-sm font-medium transition-colors hover:text-shop-blue">
                Shop
              </NavLink>
              <NavLink to="/featured" className="text-sm font-medium transition-colors hover:text-shop-blue">
                Featured
              </NavLink>
              <NavLink to="/about" className="text-sm font-medium transition-colors hover:text-shop-blue">
                About
              </NavLink>
              <NavLink to="/contact" className="text-sm font-medium transition-colors hover:text-shop-blue">
                Contact
              </NavLink>
            </nav>
          )}

          <div className="flex items-center space-x-2">
            {!showSearch && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDarkMode ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                      {cart.length}
                    </Badge>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Shopping Cart</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {cart.length === 0 ? (
                  <div className="py-4 text-center text-sm text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <>
                    <div className="max-h-96 overflow-auto">
                      {cart.map((item) => (
                        <DropdownMenuItem key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {currency} {item.discountedPrice ?? item.price}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <NavLink 
                        to="/cart"
                        className="btn-primary w-full text-center"
                      >
                        View Cart
                      </NavLink>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="py-4 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2 text-xs font-medium">
                  {currency} / {language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-gray-500">Currency</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setCurrency("USD")}>
                  USD {currency === "USD" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency("EUR")}>
                  EUR {currency === "EUR" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency("GBP")}>
                  GBP {currency === "GBP" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-gray-500">Language</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setLanguage("English")}>
                  English {language === "English" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("Spanish")}>
                  Spanish {language === "Spanish" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("French")}>
                  French {language === "French" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
