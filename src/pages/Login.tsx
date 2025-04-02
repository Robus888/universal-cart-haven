
import React, { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";
import SnowflakeContainer from "@/components/effects/SnowflakeContainer";

const Login: React.FC = () => {
  const { isAuthenticated } = useShop();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative" 
      style={{ backgroundImage: `url('https://images8.alphacoders.com/137/1377793.png')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
