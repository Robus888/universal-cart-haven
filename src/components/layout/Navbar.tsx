
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, Sun, Moon, MenuIcon, X, LogIn, LogOut, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/contexts/ShopContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import WalletButton from "@/components/WalletButton";

const Navbar: React.FC = () => {
  const {
    isDarkMode,
    toggleTheme,
    setSearchQuery,
    searchQuery,
    toggleSidebar,
    isAuthenticated,
    logout,
    user,
    cart,
    calculateCartTotal
  } = useShop();
  
  const location = useLocation();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
              onClick={toggleSidebar}
              data-sidebar-trigger="true"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>

            <NavLink to="/" className="flex items-center space-x-2">
              <img 
                src="https://cdn.discordapp.com/attachments/1092192491840737421/1344813833675604019/IMG_4837.png?ex=67c4e9fb&is=67c3987b&hm=0d8a26417443b8762f6ad41a40ac78296aafdbcc96e0d9c8abaceb69b102784c&" 
                alt="Yowx Mods Shop" 
                className="shop-logo" 
              />
              <span className="font-bold text-xl hidden sm:inline-block">Yowx Mods Shop</span>
            </NavLink>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <WalletButton />
            )}
            
            <NavLink to="/shop">
              <Button variant="ghost" size="sm">
                Shop
              </Button>
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => cart.length > 0 ? null : navigate("/cart")}>
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {cart.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="p-2">
                      {cart.slice(0, 3).map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex items-center space-x-2 p-2">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatPrice(item.discountedPrice || item.price)}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-gray-500 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const { removeFromCart } = useShop();
                              removeFromCart(item.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {cart.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                          +{cart.length - 3} more items
                        </p>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <div className="flex justify-between items-center text-sm mb-2 px-2">
                        <span>Total:</span>
                        <span className="font-semibold">{formatPrice(calculateCartTotal())}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => navigate("/cart")}
                      >
                        View Cart
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/downloads" className="flex items-center cursor-pointer">
                      <Menu className="mr-2 h-4 w-4" />
                      <span>My Downloads</span>
                    </NavLink>
                  </DropdownMenuItem>
                  {user?.is_admin && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/admin" className="flex items-center cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </NavLink>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink to="/login">
                <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
