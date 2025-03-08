
import React, { useEffect, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Globe, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { isAuthenticated, language, setLanguage, isDarkMode, toggleTheme, getTranslation, user } = useShop();
  const navigate = useNavigate();
  const [clientOS, setClientOS] = useState("Unknown");
  const [clientIP, setClientIP] = useState("Loading...");

  // Get client OS
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Windows") !== -1) setClientOS("Windows");
    else if (userAgent.indexOf("Mac") !== -1) setClientOS("MacOS");
    else if (userAgent.indexOf("Linux") !== -1) setClientOS("Linux");
    else if (userAgent.indexOf("Android") !== -1) setClientOS("Android");
    else if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) setClientOS("iOS");
    else setClientOS("Unknown");
  }, []);

  // Get client IP (simulated here)
  useEffect(() => {
    // For demo purposes, we'll use a static IP
    // In a real app, you could use a service like https://api.ipify.org
    setClientIP("181.224.230.187");
  }, []);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "English" | "Spanish" | "Portuguese" | "Vietnamese" | "Russian" | "Arabic");
  };

  // Format date as DD/MM/YYYY - HH:MM:SS
  const formatDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">{getTranslation("generalSettings")}</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {getTranslation("userInformation")}
            </CardTitle>
            <CardDescription>
              {user?.email}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTranslation("joined")}
                  </p>
                  <p className="font-medium">
                    {formatDate()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTranslation("id")}
                  </p>
                  <p className="font-medium">
                    {user?.id ? user.id.substring(0, 3) : ""}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTranslation("accessOS")}
                  </p>
                  <p className="font-medium">
                    {clientOS}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTranslation("accessingIP")}
                  </p>
                  <p className="font-medium">
                    {clientIP}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="public/lovable-uploads/352e357c-d995-4294-978e-dc8c52718d99.png" 
                alt="User Info"
                className="w-64 h-auto rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {getTranslation("generalSettings")}
            </CardTitle>
            <CardDescription>
              Customize your preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base flex items-center gap-2" htmlFor="theme">
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {getTranslation("theme")}
              </Label>
              
              <div className="flex items-center gap-3 mt-3">
                <Button
                  variant={isDarkMode ? "outline" : "default"}
                  size="sm"
                  className="gap-2"
                  onClick={!isDarkMode ? undefined : toggleTheme}
                >
                  <Sun className="h-4 w-4" />
                  {getTranslation("light")}
                </Button>
                
                <Button
                  variant={!isDarkMode ? "outline" : "default"}
                  size="sm"
                  className="gap-2"
                  onClick={isDarkMode ? undefined : toggleTheme}
                >
                  <Moon className="h-4 w-4" />
                  {getTranslation("dark")}
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-base flex items-center gap-2 mb-3" htmlFor="language">
                <Globe className="h-4 w-4" />
                {getTranslation("language")}
              </Label>
              
              <Select
                value={language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger id="language" className="w-full sm:w-[240px]">
                  <SelectValue placeholder={getTranslation("language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Español</SelectItem>
                  <SelectItem value="Portuguese">Português</SelectItem>
                  <SelectItem value="Vietnamese">Tiếng Việt</SelectItem>
                  <SelectItem value="Russian">Русский</SelectItem>
                  <SelectItem value="Arabic">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
