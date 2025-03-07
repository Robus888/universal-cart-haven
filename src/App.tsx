
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Wallet from "@/pages/Wallet";
import Downloads from "@/pages/Downloads";
import NotFound from "@/pages/NotFound";
import AdminPanel from "@/components/admin/AdminPanel";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import PromoCodes from "@/pages/PromoCodes";
import { useShop } from "@/contexts/ShopContext";

const App = () => {
  const { isAuthenticated, user } = useShop();
  
  return (
    <div className="app-container min-h-screen flex flex-col">
      <Routes>
        <Route element={<MainLayout children={<Outlet />} />}>
          <Route index element={<Index />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:productId" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="promocodes" element={<PromoCodes />} />
          
          {/* Protected routes - only accessible when authenticated */}
          {isAuthenticated && (
            <>
              <Route path="wallet" element={<Wallet />} />
              <Route path="downloads" element={<Downloads />} />
              
              {/* Admin/Owner routes */}
              {user?.is_admin && (
                <Route path="admin" element={<AdminPanel />} />
              )}
            </>
          )}
          
          {/* Auth routes - not accessible when authenticated */}
          {!isAuthenticated && (
            <>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </>
          )}
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
