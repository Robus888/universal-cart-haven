
import React from "react";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login } = useShop();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const { formState: { isSubmitting } } = form;
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <div className="h-16 w-16 bg-shop-blue rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 7L12 12L4 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <NavLink
                    to="/forgot-password"
                    className="text-xs text-shop-blue hover:underline"
                  >
                    Forgot password?
                  </NavLink>
                </div>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full bg-shop-blue hover:bg-shop-darkBlue"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-shop-blue hover:underline font-medium"
              >
                Sign up
              </NavLink>
            </p>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default LoginForm;
