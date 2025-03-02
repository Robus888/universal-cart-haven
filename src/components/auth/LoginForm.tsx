
import React, { useEffect } from "react";
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
import { toast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login, isAuthenticated } = useShop();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const { formState: { isSubmitting }, setError } = form;
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      console.log("Attempting login with:", values.email);
      await login(values.email, values.password);
      // Navigation is handled in the ShopContext after successful login
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Set form errors based on the error message
      if (error.message?.includes("Invalid login credentials")) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
        
        setError("email", { message: "Invalid email or password" });
        setError("password", { message: "Invalid email or password" });
      } else {
        toast({
          variant: "destructive",
          title: "Login error",
          description: error.message || "An unexpected error occurred",
        });
      }
      
      // Reset the submitting state to enable the button again
      form.reset({ email: values.email, password: "" });
    }
  };
  
  return (
    <motion.div 
      className="bg-black/80 backdrop-blur-xl p-8 rounded-lg shadow-lg max-w-md w-full mx-auto border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
          <img 
            src="https://cdn.discordapp.com/attachments/1092192491840737421/1344813833675604019/IMG_4837.png?ex=67c246fb&is=67c0f57b&hm=70a394743fb2a83b82ae74ddfbe72f8a27d3d7c5f0311d47c63cb30a5319b2a1&" 
            alt="Yowx Mods Shop"
            className="h-16 w-16 object-cover" 
          />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-gray-400 mt-1">Sign in to your account</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <NavLink
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </NavLink>
                </div>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-blue-400 hover:underline font-medium"
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
