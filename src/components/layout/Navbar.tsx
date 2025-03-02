
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useShop } from "@/contexts/ShopContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ShoppingCart,
  LogIn,
  User,
  CreditCard,
  LogOut,
  Download,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import WalletButton from "@/components/WalletButton";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    toggleSidebar,
    isAuthenticated,
    user,
    logout,
    cart,
  } = useShop();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  const handleDownloads = () => {
    navigate("/downloads");
  };

  const handleWallet = () => {
    navigate("/wallet");
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div
                className="text-xl font-bold cursor-pointer ml-2"
                onClick={() => navigate("/")}
              >
                Digital Shop
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleCart}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <>
                <WalletButton />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user?.username || "Account"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleWallet}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloads}>
                      <Download className="mr-2 h-4 w-4" />
                      Downloads
                    </DropdownMenuItem>
                    {(user?.is_admin || user?.is_owner) && (
                      <DropdownMenuItem onClick={handleAdminPanel}>
                        <Settings className="mr-2 h-4 w-4" />
                        {user.is_owner ? "Owner Panel" : "Admin Panel"}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <LogIn className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogin}>Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRegister}>
                    Register
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
