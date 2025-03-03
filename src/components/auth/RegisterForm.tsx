
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
import { toast } from "@/components/ui/use-toast";

const registerSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register } = useShop();
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const { formState: { isSubmitting }, setError } = form;
  
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      console.log("Attempting registration with:", values.email);
      await register(values.username, values.email, values.password);
      toast({
        title: "Account created successfully",
        description: "You can now login with your credentials.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      // Handle specific errors for better user experience
      if (error.message?.includes("User already registered")) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "This email is already registered. Please use a different email or login instead.",
        });
        setError("email", { message: "This email is already registered" });
      } else {
        toast({
          variant: "destructive",
          title: "Registration error",
          description: error.message || "An unexpected error occurred",
        });
      }
      
      // Keep form data except password
      form.reset({ 
        username: values.username,
        email: values.email,
        password: "",
        confirmPassword: ""
      });
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
        <h1 className="text-2xl font-bold text-white">Create an account</h1>
        <p className="text-gray-400 mt-1">Sign up to get started</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    autoComplete="username"
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
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Create a password"
                    type="password"
                    autoComplete="new-password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    autoComplete="new-password"
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-blue-400 hover:underline font-medium"
              >
                Sign in
              </NavLink>
            </p>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default RegisterForm;
