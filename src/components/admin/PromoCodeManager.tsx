
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/contexts/ShopContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag, Trash2, CheckCircle, XCircle } from "lucide-react";
import { PromoCode } from "@/types/shop";
import { Switch } from "@/components/ui/switch";

const promoCodeSchema = z.object({
  code: z.string().min(3, {
    message: "Promo code must be at least 3 characters long",
  }).max(20, {
    message: "Promo code must not exceed 20 characters",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least 1",
  }),
  maxRedemptions: z.coerce.number().min(1, {
    message: "Maximum redemptions must be at least 1",
  }),
});

type PromoCodeFormValues = z.infer<typeof promoCodeSchema>;

const PromoCodeManager: React.FC = () => {
  const { user, getTranslation } = useShop();
  const [isCreating, setIsCreating] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      amount: 10,
      maxRedemptions: 10,
    },
  });

  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setPromoCodes(data as PromoCode[]);
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load promo codes",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const onSubmit = async (data: PromoCodeFormValues) => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      // Check if code already exists
      const { data: existingCode, error: checkError } = await supabase
        .from("promo_codes")
        .select("id")
        .eq("code", data.code)
        .maybeSingle();

      if (checkError) {
        throw new Error("Error checking existing promo code");
      }

      if (existingCode) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "This promo code already exists",
        });
        return;
      }

      // Insert new promo code
      const { error } = await supabase
        .from("promo_codes")
        .insert({
          code: data.code,
          amount: data.amount,
          max_redemptions: data.maxRedemptions,
          current_redemptions: 0,
          active: true,
          created_by: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Promo code created",
        description: `Successfully created promo code: ${data.code}`,
      });

      form.reset({
        code: "",
        amount: 10,
        maxRedemptions: 10,
      });

      // Refresh the list
      fetchPromoCodes();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create promo code",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const togglePromoCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("promo_codes")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Status updated",
        description: `Promo code status updated to ${!currentStatus ? "active" : "inactive"}`,
      });

      // Update the local state
      setPromoCodes(prevCodes => 
        prevCodes.map(code => 
          code.id === id ? {...code, active: !currentStatus} : code
        )
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update promo code status",
      });
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from("promo_codes")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Promo code deleted",
        description: "Successfully deleted the promo code",
      });

      // Update the local state
      setPromoCodes(prevCodes => prevCodes.filter(code => code.id !== id));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete promo code",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {getTranslation("createPromoCode")}
          </CardTitle>
          <CardDescription>
            Create a new promo code for users to redeem
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("code")}</FormLabel>
                      <FormControl>
                        <Input placeholder="SUMMER2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("promoCodeAmount")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxRedemptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("maxRedemptions")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="mt-2"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : getTranslation("create")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("promoCodeList")}</CardTitle>
          <CardDescription>
            Manage existing promo codes
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading promo codes...</p>
            </div>
          ) : promoCodes.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">{getTranslation("noPromoCodes")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{getTranslation("code")}</TableHead>
                    <TableHead>{getTranslation("promoCodeAmount")}</TableHead>
                    <TableHead className="text-center">{getTranslation("redemptions")}</TableHead>
                    <TableHead className="text-center">{getTranslation("active")}</TableHead>
                    <TableHead className="text-right">{getTranslation("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promoCode) => (
                    <TableRow key={promoCode.id}>
                      <TableCell className="font-medium">{promoCode.code}</TableCell>
                      <TableCell>${promoCode.amount}</TableCell>
                      <TableCell className="text-center">
                        {promoCode.current_redemptions} / {promoCode.max_redemptions}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={promoCode.active}
                          onCheckedChange={() => togglePromoCodeStatus(promoCode.id, promoCode.active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePromoCode(promoCode.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodeManager;
