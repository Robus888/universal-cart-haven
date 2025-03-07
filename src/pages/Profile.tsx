
import React, { useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Key, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema for username change
const usernameSchema = z.object({
  newUsername: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }).max(20, {
    message: "Username must not exceed 20 characters",
  }),
});

// Schema for password change
const passwordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type UsernameFormValues = z.infer<typeof usernameSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { user, isAuthenticated, changeUsername, changePassword, getTranslation } = useShop();
  const navigate = useNavigate();
  const [usernameChanging, setUsernameChanging] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      newUsername: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onUsernameSubmit = async (data: UsernameFormValues) => {
    if (!user) return;
    
    setUsernameChanging(true);
    try {
      const success = await changeUsername(data.newUsername);
      if (success) {
        usernameForm.reset();
      }
    } finally {
      setUsernameChanging(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordChanging(true);
    try {
      const success = await changePassword(data.currentPassword, data.newPassword);
      if (success) {
        passwordForm.reset();
      }
    } finally {
      setPasswordChanging(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">{getTranslation("profileSettings")}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {getTranslation("changeUsername")}
            </CardTitle>
            <CardDescription>
              {getTranslation("usernameChangeLimit")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getTranslation("currentUsername")}
                </p>
                <p className="font-medium">{user.username}</p>
              </div>
            </div>
            
            <Form {...usernameForm}>
              <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
                <FormField
                  control={usernameForm.control}
                  name="newUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("newUsername")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter new username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={usernameChanging}
                >
                  {usernameChanging ? "Saving..." : getTranslation("save")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              {getTranslation("changePassword")}
            </CardTitle>
            <CardDescription>
              {getTranslation("updatePassword")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                You will need to log in again after changing your password.
              </AlertDescription>
            </Alert>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("currentPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("newPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("confirmPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={passwordChanging}
                >
                  {passwordChanging ? "Updating..." : getTranslation("updatePassword")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
