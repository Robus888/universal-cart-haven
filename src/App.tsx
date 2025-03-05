
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Shop from '@/pages/Shop';
import Cart from '@/pages/Cart';
import ProductDetail from '@/pages/ProductDetail';
import Wallet from '@/pages/Wallet';
import Downloads from '@/pages/Downloads';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { Toaster } from "@/components/ui/toaster"
import PaymentMethod from "@/pages/PaymentMethod";
import Profile from "@/pages/Profile";
import PopularProducts from "@/pages/PopularProducts";
import FreeCoins from "@/pages/FreeCoins";
import Promocodes from "@/pages/Promocodes";
import OnlineUsers from "@/components/OnlineUsers";
import TapAnimation from "@/components/TapAnimation";

function App() {
  return (
    <div className="app">
      <OnlineUsers />
      <TapAnimation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/popular-products" element={<PopularProducts />} />
        <Route path="/free-coins" element={<FreeCoins />} />
        <Route path="/promocodes" element={<Promocodes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
