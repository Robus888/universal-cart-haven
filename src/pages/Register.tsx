
import React, { useEffect } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { isAuthenticated } = useShop();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 items-center justify-center p-4 bg-gray-50 dark:bg-gray-900"
      >
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
