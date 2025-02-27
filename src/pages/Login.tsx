
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 items-center justify-center p-4 bg-gray-50 dark:bg-gray-900"
      >
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
