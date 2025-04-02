
import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
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
import OwnerPanel from "@/components/admin/OwnerPanel";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import PromoCodes from "@/pages/PromoCodes";
import PaymentMethods from "@/pages/PaymentMethods";
import OrderHistory from "@/pages/OrderHistory";
import { useShop } from "@/contexts/ShopContext";
import SnowflakeContainer from "@/components/effects/SnowflakeContainer";

const App = () => {
  const { isAuthenticated, user } = useShop();
  
  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Admin route component  
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated || !user?.is_admin) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  // Owner route component
  const OwnerRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated || !user?.is_owner) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };
  
  return (
    <div className="app-container min-h-screen flex flex-col">
      <SnowflakeContainer count={20} />
      <Routes>
        <Route element={<MainLayout children={<Outlet />} />}>
          <Route index element={<Index />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:productId" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="promocodes" element={<PromoCodes />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="history" element={<OrderHistory />} />
          
          {/* Protected routes */}
          <Route path="wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />
          
          <Route path="downloads" element={
            <ProtectedRoute>
              <Downloads />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          
          {/* Owner routes */}
          <Route path="owner" element={
            <OwnerRoute>
              <OwnerPanel />
            </OwnerRoute>
          } />
          
          {/* Auth routes - not accessible when authenticated */}
          <Route path="login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
