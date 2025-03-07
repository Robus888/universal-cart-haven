
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PromoCode } from "@/types/shop";
import { useShop } from "@/contexts/ShopContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tag, Trash2, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const promoCodeSchema = z.object({
  code: z.string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must not exceed 20 characters"),
  amount: z.coerce.number()
    .min(1, "Amount must be at least 1")
    .max(1000000, "Amount must not exceed 1,000,000"),
  max_redemptions: z.coerce.number()
    .min(0, "Must be at least 0 (0 means unlimited)")
    .max(10000, "Must not exceed 10,000"),
  active: z.boolean().default(true),
});

type PromoFormValues = z.infer<typeof promoCodeSchema>;

const PromoCodeManager: React.FC = () => {
  const { user } = useShop();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PromoFormValues>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      amount: 100,
      max_redemptions: 1,
      active: true,
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
      
      setPromoCodes(data as PromoCode[]);
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
  
  const onSubmit = async (values: PromoFormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if code already exists
      const { data: existingCode, error: checkError } = await supabase
        .from("promo_codes")
        .select("code")
        .eq("code", values.code)
        .maybeSingle();
        
      if (checkError) {
        throw new Error("Error checking existing promo code");
      }
      
      if (existingCode) {
        throw new Error("This promo code already exists");
      }
      
      // Insert new promo code
      const { error: insertError } = await supabase
        .from("promo_codes")
        .insert({
          code: values.code,
          amount: values.amount,
          max_redemptions: values.max_redemptions,
          current_redemptions: 0,
          active: values.active,
          created_by: user.id,
        });
        
      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: "Promo code created",
        description: `Promo code ${values.code} has been created successfully`,
      });
      
      // Reset form
      form.reset({
        code: "",
        amount: 100,
        max_redemptions: 1,
        active: true,
      });
      
      // Refresh list
      fetchPromoCodes();
    } catch (error) {
      let message = "Failed to create promo code";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
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
        title: `Promo code ${currentStatus ? "deactivated" : "activated"}`,
        description: `The promo code has been ${currentStatus ? "deactivated" : "activated"} successfully.`,
      });
      
      // Refresh list
      fetchPromoCodes();
    } catch (error) {
      console.error("Error toggling promo code status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update promo code status",
      });
    }
  };
  
  const deletePromoCode = async (id: string) => {
    try {
      // First check if the promo code has been redeemed
      const { data: redemptions, error: checkError } = await supabase
        .from("promo_redemptions")
        .select("id")
        .eq("promo_code_id", id)
        .limit(1);
        
      if (checkError) {
        throw checkError;
      }
      
      if (redemptions && redemptions.length > 0) {
        // If the code has been redeemed, just deactivate it instead of deleting
        const { error: updateError } = await supabase
          .from("promo_codes")
          .update({ active: false })
          .eq("id", id);
          
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Promo code deactivated",
          description: "This code has already been used, so it was deactivated instead of deleted.",
        });
      } else {
        // If no redemptions, delete the promo code
        const { error: deleteError } = await supabase
          .from("promo_codes")
          .delete()
          .eq("id", id);
          
        if (deleteError) {
          throw deleteError;
        }
        
        toast({
          title: "Promo code deleted",
          description: "The promo code has been permanently deleted.",
        });
      }
      
      // Refresh list
      fetchPromoCodes();
    } catch (error) {
      console.error("Error deleting promo code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete promo code",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Create Promo Code
          </CardTitle>
          <CardDescription>
            Create a new promo code that users can redeem to get funds in their wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promo Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SUMMER2023" {...field} />
                      </FormControl>
                      <FormDescription>
                        The code users will enter to receive funds
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        The amount of funds users will receive
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="max_redemptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Redemptions</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum number of times this code can be redeemed (0 for unlimited)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active
                        </FormLabel>
                        <FormDescription>
                          Make the promo code active and redeemable
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Promo Code"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Promo Codes
          </CardTitle>
          <CardDescription>
            Manage existing promo codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading promo codes...</div>
          ) : promoCodes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No promo codes have been created yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Redemptions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono font-medium">
                        {code.code}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        }).format(Number(code.amount))}
                      </TableCell>
                      <TableCell>
                        {code.current_redemptions} / {code.max_redemptions > 0 ? code.max_redemptions : "∞"}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          code.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {code.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(code.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePromoCodeStatus(code.id, code.active)}
                          >
                            {code.active ? "Deactivate" : "Activate"}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Promo Code</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the promo code "{code.code}"? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deletePromoCode(code.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
