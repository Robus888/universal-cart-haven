
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
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://4kwallpapers.com/images/wallpapers/anime-girl-dream-2880x1800-10024.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" /> {/* Overlay to improve readability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 items-center justify-center p-4 relative z-10"
      >
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
