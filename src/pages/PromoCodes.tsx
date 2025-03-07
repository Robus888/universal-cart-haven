
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
import { Tag } from "lucide-react";

const promoCodeSchema = z.object({
  code: z.string().min(3, {
    message: "Promo code must be at least 3 characters long",
  }).max(20, {
    message: "Promo code must not exceed 20 characters",
  }),
});

type PromoCodeFormValues = z.infer<typeof promoCodeSchema>;

const PromoCodes = () => {
  const { user, isAuthenticated, redeemPromoCode, getTranslation } = useShop();
  const navigate = useNavigate();
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: PromoCodeFormValues) => {
    if (!user) return;
    
    setIsRedeeming(true);
    try {
      const success = await redeemPromoCode(data.code);
      if (success) {
        form.reset();
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-lg py-8">
      <h1 className="text-3xl font-bold mb-8">{getTranslation("promocodes")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {getTranslation("enterPromoCode")}
          </CardTitle>
          <CardDescription>
            Enter a promo code to receive balance
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("code")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter promo code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isRedeeming}
              >
                {isRedeeming ? "Redeeming..." : getTranslation("redeem")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodes;
