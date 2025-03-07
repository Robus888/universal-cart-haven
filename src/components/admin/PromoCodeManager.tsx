
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Trash2, Plus, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PromoCode } from "@/types/shop";

const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [newCode, setNewCode] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newMaxRedemptions, setNewMaxRedemptions] = useState(0);
  const [newActive, setNewActive] = useState(true);
  
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [deletingCode, setDeletingCode] = useState<PromoCode | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPromoCodes();
  }, []);
  
  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        throw new Error("Not authorized");
      }
      
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
        description: "Failed to load promo codes"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePromoCode = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        throw new Error("Not authorized");
      }
      
      if (!newCode) {
        throw new Error("Promo code cannot be empty");
      }
      
      if (newAmount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      
      // Check if code already exists
      const { data: existingCode, error: checkError } = await supabase
        .from("promo_codes")
        .select("id")
        .eq("code", newCode)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingCode) {
        throw new Error("This promo code already exists");
      }
      
      const { error } = await supabase
        .from("promo_codes")
        .insert({
          code: newCode,
          amount: newAmount,
          max_redemptions: newMaxRedemptions,
          current_redemptions: 0,
          active: newActive,
          created_by: userData.user.id
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Promo code "${newCode}" has been created`
      });
      
      // Reset form and close dialog
      setNewCode("");
      setNewAmount(0);
      setNewMaxRedemptions(0);
      setNewActive(true);
      setCreateDialogOpen(false);
      
      // Refresh the list
      fetchPromoCodes();
    } catch (error) {
      console.error("Error creating promo code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create promo code"
      });
    }
  };
  
  const handleUpdatePromoCode = async () => {
    try {
      if (!editingCode) return;
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        throw new Error("Not authorized");
      }
      
      const { error } = await supabase
        .from("promo_codes")
        .update({
          active: editingCode.active,
          max_redemptions: editingCode.max_redemptions,
          amount: editingCode.amount
        })
        .eq("id", editingCode.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Promo code "${editingCode.code}" has been updated`
      });
      
      setEditingCode(null);
      setEditDialogOpen(false);
      
      // Refresh the list
      fetchPromoCodes();
    } catch (error) {
      console.error("Error updating promo code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update promo code"
      });
    }
  };
  
  const handleDeletePromoCode = async () => {
    try {
      if (!deletingCode) return;
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        throw new Error("Not authorized");
      }
      
      const { error } = await supabase
        .from("promo_codes")
        .delete()
        .eq("id", deletingCode.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Promo code "${deletingCode.code}" has been deleted`
      });
      
      setDeletingCode(null);
      setDeleteDialogOpen(false);
      
      // Refresh the list
      fetchPromoCodes();
    } catch (error) {
      console.error("Error deleting promo code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete promo code"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Promo Codes</CardTitle>
            <CardDescription>
              Create and manage promotional codes for users
            </CardDescription>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Code
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading promo codes...</div>
        ) : promoCodes.length === 0 ? (
          <div className="text-center py-4">No promo codes found</div>
        ) : (
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
              {promoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell className="font-medium">{promoCode.code}</TableCell>
                  <TableCell>{promoCode.amount}</TableCell>
                  <TableCell>
                    {promoCode.current_redemptions} / 
                    {promoCode.max_redemptions > 0 
                      ? promoCode.max_redemptions 
                      : "∞"}
                  </TableCell>
                  <TableCell>
                    <span className={`py-1 px-2 rounded text-xs ${
                      promoCode.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {promoCode.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(promoCode.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingCode(promoCode);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setDeletingCode(promoCode);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Promo Code</DialogTitle>
              <DialogDescription>
                Add a new promotional code for users to redeem balance
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="WELCOME2023"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxRedemptions">
                  Max Redemptions (0 for unlimited)
                </Label>
                <Input
                  id="maxRedemptions"
                  type="number"
                  value={newMaxRedemptions}
                  onChange={(e) => setNewMaxRedemptions(Number(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newActive}
                  onCheckedChange={setNewActive}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreatePromoCode}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Promo Code</DialogTitle>
              <DialogDescription>
                Update the promo code details
              </DialogDescription>
            </DialogHeader>
            
            {editingCode && (
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code</Label>
                  <Input
                    id="edit-code"
                    value={editingCode.code}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={editingCode.amount}
                    onChange={(e) => setEditingCode({
                      ...editingCode,
                      amount: Number(e.target.value)
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-maxRedemptions">
                    Max Redemptions (0 for unlimited)
                  </Label>
                  <Input
                    id="edit-maxRedemptions"
                    type="number"
                    value={editingCode.max_redemptions}
                    onChange={(e) => setEditingCode({
                      ...editingCode,
                      max_redemptions: Number(e.target.value)
                    })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={editingCode.active}
                    onCheckedChange={(checked) => setEditingCode({
                      ...editingCode,
                      active: checked
                    })}
                  />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdatePromoCode}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Promo Code</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this promo code?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {deletingCode && (
              <div className="py-4">
                <p>
                  You are about to delete the promo code:
                  <span className="font-bold ml-1">{deletingCode.code}</span>
                </p>
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDeletePromoCode}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PromoCodeManager;
