
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Wallet from "@/pages/Wallet";
import Downloads from "@/pages/Downloads";
import Settings from "@/pages/Settings";
import { ThemeProvider } from "@/hooks/useTheme";
import { ShopProvider } from "@/contexts/ShopContext";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ShopProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
            <Route path="/shop/:productId" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/wallet" element={<MainLayout><Wallet /></MainLayout>} />
            <Route path="/downloads" element={<MainLayout><Downloads /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
          <Toaster />
        </ShopProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
