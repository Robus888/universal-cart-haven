
import React, { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";

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
    <LoginForm />
  );
};

export default Login;
