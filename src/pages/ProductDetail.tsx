
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductSubscription from "@/components/shop/ProductSubscription";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Share, Heart, Check, AlertCircle, Truck, ExternalLink, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type SubscriptionPeriod = "weekly" | "monthly";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    currency, 
    purchaseProduct, 
    viewProductDetails, 
    user, 
    isProductPurchased,
    isInCart
  } = useShop();
  
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<SubscriptionPeriod>("weekly");
  const [subscriptionPrice, setSubscriptionPrice] = useState<number>(5.00);
  
  const product = products.find((p) => p.id === id);
  
  if (!product) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/shop")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const isPurchased = isProductPurchased(product.id);
  const isItemInCart = isInCart(product.id);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
  };

  const handlePurchase = async () => {
    const productWithSubscription = {
      ...product,
      price: subscriptionPrice,
      subscriptionPeriod
    };
    await purchaseProduct(productWithSubscription);
  };

  const handleAddToCart = () => {
    const productWithSubscription = {
      ...product,
      price: subscriptionPrice,
      subscriptionPeriod
    };
    addToCart(productWithSubscription);
  };

  const handleViewDetails = () => {
    viewProductDetails(product.id);
  };

  const handleSubscriptionChange = (period: SubscriptionPeriod, price: number) => {
    setSubscriptionPeriod(period);
    setSubscriptionPrice(price);
  };

  const getDownloadLinks = () => {
    let downloadIpaLink = "https://www.mediafire.com/file/p06ndef7dsgvt9r/Free+Fire_1.108.1_1739330951.ipa/file";
    
    if (product.id === "1") {
      downloadIpaLink = "https://mediafire2.com";
    } else if (product.id === "2") {
      downloadIpaLink = "https://mediafire5.com";
    } else if (product.id === "3") {
      downloadIpaLink = "https://yowx33.com";
    }
    
    return {
      downloadIpa: downloadIpaLink,
      requestKey: "https://t.me/yowxios"
    };
  };
  
  return (
    <MainLayout>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="aspect-square bg-gray-100 dark:bg-gray-900 p-8 flex items-center justify-center">
            <img 
              src={product.image || "https://via.placeholder.com/600"} 
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{product.category}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handleViewDetails}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Subscription Period Selector */}
            {!isPurchased && (
              <ProductSubscription 
                productId={product.id} 
                onPeriodChange={handleSubscriptionChange}
              />
            )}
            
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-shop-blue">
                  {formatPrice(subscriptionPrice)}
                </span>
                <span className="bg-shop-blue/10 text-shop-blue text-sm font-medium px-2.5 py-0.5 rounded">
                  {subscriptionPeriod === "weekly" ? "Weekly" : "Monthly"} Plan
                </span>
              </div>
            </div>
            
            {user && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm">Your balance: <span className="font-bold">{formatPrice(user.balance)}</span></p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="feature-list-item">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-500">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {product.stock > 10 ? 
                      "In Stock" : 
                      `Only ${product.stock} left in stock`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {isPurchased ? (
                <Button 
                  onClick={() => setShowDownloadDialog(true)} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download IPA
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handlePurchase} 
                    disabled={product.stock === 0 || !user || user.balance < subscriptionPrice}
                    className="w-full bg-shop-blue hover:bg-shop-darkBlue"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now {user && user.balance < subscriptionPrice && "(Insufficient Balance)"}
                  </Button>
                  
                  <Button 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0 || isItemInCart}
                    variant="outline"
                    className="w-full"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isItemInCart ? "Already in Cart" : "Add to Cart"}
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Truck className="h-4 w-4 mr-1" />
              <span>Digital delivery - instant access after purchase</span>
            </div>
            
            <div className="mt-2 text-xs text-red-500">
              * {subscriptionPeriod === "weekly" ? "Weekly" : "Monthly"} plans expire after {subscriptionPeriod === "weekly" ? "7" : "30"} days. You will need to renew your subscription to maintain access.
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Details</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Technical Specifications</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="feature-list-item">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this product.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-semibold mb-1">How does the subscription work?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You can choose between weekly (7 days) or monthly (30 days) access. After this period, your access will expire and you'll need to purchase again.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-md font-semibold mb-1">Do you offer refunds?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Due to the digital nature of the product, all sales are final. Please contact our support team if you encounter any issues.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-md font-semibold mb-1">Will I receive updates during my subscription?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you'll have access to all updates released during your subscription period.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download {product.name}</DialogTitle>
            <DialogDescription>
              Choose your download option below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button 
              className="w-full bg-shop-blue hover:bg-shop-darkBlue"
              onClick={() => window.open(getDownloadLinks().downloadIpa, "_blank")}
            >
              <Download className="mr-2 h-4 w-4" />
              Download IPA Now
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => window.open(getDownloadLinks().requestKey, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Request Key
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDownloadDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProductDetail;
