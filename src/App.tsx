import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./contexts/ShopContext";
import { ThemeProvider } from "./hooks/useTheme";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Wallet from "./pages/Wallet";
import Downloads from "./pages/Downloads";
import AdminPanel from "./components/admin/AdminPanel";
import OwnerPanel from "./components/admin/OwnerPanel";
import Announcement from "./components/Announcement";
import "./App.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <ShopProvider>
          <ThemeProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/owner" element={<OwnerPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Announcement />
          </ShopProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
