
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";

const Register: React.FC = () => {
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
