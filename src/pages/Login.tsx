
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://wallpapercave.com/wp/wp7158601.jpg)' }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-4 z-10"
      >
        <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-shop-blue flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 7L12 12L4 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl">Login to YOWX MODS</CardTitle>
            <p className="text-sm text-white/70 mt-1">Welcome back! Please sign in to your account</p>
          </CardHeader>
          <CardContent className="pt-4">
            <LoginForm />
            
            <div className="mt-4 text-center text-sm text-white/70">
              <span>Don't have an account? </span>
              <NavLink to="/register" className="text-shop-blue hover:underline">
                Register
              </NavLink>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
