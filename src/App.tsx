
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./contexts/ShopContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AdminPanel from "./components/admin/AdminPanel";
import Wallet from "./pages/Wallet";
import Downloads from "./pages/Downloads";
import Cart from "./pages/Cart";
import "./App.css";

function App() {
  return (
    <Router>
      <ShopProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ShopProvider>
    </Router>
  );
}

export default App;
