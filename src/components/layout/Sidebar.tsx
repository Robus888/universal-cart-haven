
import React from "react";
import { useShop } from "@/contexts/ShopContext";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  Clock, 
  Award, 
  Download, 
  CreditCard, 
  Receipt, 
  Wallet, 
  X, 
  User, 
  Settings, 
  LogOut,
  Gift,
  Ticket,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label
}) => (
  <NavLink 
    to={to} 
    className={({isActive}) => cn("sidebar-item", isActive && "active")}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    isAuthenticated,
    user,
    logout,
    currency
  } = useShop();
  
  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };
  
  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-shop-blue/10 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8">
          <NavLink 
            to="/" 
            className="flex items-center space-x-2" 
            onClick={handleCloseSidebar}
          >
            <div className="h-10 w-10 rounded-full bg-shop-blue flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 7L12 12L4 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">YOWX MODS</span>
          </NavLink>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center space-x-2 mb-6 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-shop-blue flex items-center justify-center text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Balance: {currency} {user.balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6 flex-1">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Main Menu
            </p>
            <nav className="space-y-1">
              <SidebarItem to="/" icon={<Home size={18} />} label="Home" />
              <SidebarItem to="/shop" icon={<ShoppingCart size={18} />} label="Shop" />
              <SidebarItem to="/history" icon={<Clock size={18} />} label="Order History" />
              <SidebarItem to="/popular-products" icon={<Award size={18} />} label="Top Products" />
              <SidebarItem to="/downloads" icon={<Download size={18} />} label="Downloads" />
              <SidebarItem to="/free-coins" icon={<CalendarDays size={18} />} label="Free Coins" />
              <SidebarItem to="/promocodes" icon={<Ticket size={18} />} label="Promocodes" />
            </nav>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Payments
            </p>
            <nav className="space-y-1">
              <SidebarItem to="/payment-method" icon={<CreditCard size={18} />} label="Payment Methods" />
              <SidebarItem to="/invoices" icon={<Receipt size={18} />} label="Invoices" />
              <SidebarItem to="/wallet" icon={<Wallet size={18} />} label="Wallet" />
            </nav>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          {!isAuthenticated ? (
            <div className="space-y-2">
              <NavLink 
                to="/login" 
                className="btn-primary w-full justify-center flex items-center" 
                onClick={handleCloseSidebar}
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="btn-secondary w-full justify-center flex items-center" 
                onClick={handleCloseSidebar}
              >
                Register
              </NavLink>
            </div>
          ) : (
            <div className="space-y-1">
              <NavLink 
                to="/profile" 
                className="sidebar-item" 
                onClick={handleCloseSidebar}
              >
                <User size={18} />
                <span>Profile</span>
              </NavLink>
              <NavLink 
                to="/settings" 
                className="sidebar-item" 
                onClick={handleCloseSidebar}
              >
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
              <button 
                className="sidebar-item w-full text-left text-red-500 hover:bg-red-500/10" 
                onClick={logout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
