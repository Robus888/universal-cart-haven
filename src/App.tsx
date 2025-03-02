
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./contexts/ShopContext";
import MainLayout from "./components/layout/MainLayout";
import { ThemeProvider } from "./hooks/useTheme";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Wallet from "./pages/Wallet";
import Downloads from "./pages/Downloads";
import OwnerPanel from "./pages/OwnerPanel";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ShopProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/admin" element={<OwnerPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
          <Toaster />
        </ShopProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
