
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
  usernameOrEmail: z.string().min(3, { message: "Please enter a valid username or email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login, isAuthenticated, getTranslation } = useShop();
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
      usernameOrEmail: "",
      password: "",
    },
  });
  
  const { formState: { isSubmitting }, setError } = form;
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.usernameOrEmail, values.password);
      // Navigation is handled in the ShopContext after successful login
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Set form errors based on the error message
      if (error.message?.includes("Invalid login credentials") || error.message?.includes("Username not found")) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username/email or password. Please try again.",
        });
        
        setError("usernameOrEmail", { message: "Invalid username/email or password" });
        setError("password", { message: "Invalid username/email or password" });
      } else {
        toast({
          variant: "destructive",
          title: "Login error",
          description: error.message || "An unexpected error occurred",
        });
      }
      
      // Reset the submitting state to enable the button again
      form.reset({ usernameOrEmail: values.usernameOrEmail, password: "" });
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
        <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
          <img 
            src="https://cdn.discordapp.com/attachments/1092192491840737421/1344813833675604019/IMG_4837.png?ex=67c246fb&is=67c0f57b&hm=70a394743fb2a83b82ae74ddfbe72f8a27d3d7c5f0311d47c63cb30a5319b2a1&" 
            alt="Yowx Mods Shop"
            className="h-16 w-16 object-cover" 
          />
        </div>
        <h1 className="text-2xl font-bold">{getTranslation("welcomeBack")}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{getTranslation("signInToAccount")}</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{getTranslation("username")}/{getTranslation("email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`${getTranslation("enterUsername")} / ${getTranslation("enterEmail")}`}
                    autoComplete="username"
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
                  <FormLabel>{getTranslation("password")}</FormLabel>
                  <NavLink
                    to="/forgot-password"
                    className="text-xs text-shop-blue hover:underline"
                  >
                    {getTranslation("forgotPassword")}
                  </NavLink>
                </div>
                <FormControl>
                  <Input
                    placeholder={getTranslation("enterPassword")}
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
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? getTranslation("signingIn") : getTranslation("signIn")}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getTranslation("dontHaveAccount")}{" "}
              <NavLink
                to="/register"
                className="text-shop-blue hover:underline font-medium"
              >
                {getTranslation("signUp")}
              </NavLink>
            </p>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default LoginForm;
