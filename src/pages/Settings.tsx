
import React from "react";
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
import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { isAuthenticated, language, setLanguage, isDarkMode, toggleTheme, getTranslation } = useShop();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "English" | "Spanish");
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">{getTranslation("generalSettings")}</h1>

      <div className="grid gap-8">
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
