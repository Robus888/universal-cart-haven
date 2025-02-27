
import React, { useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductGrid from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

const Shop: React.FC = () => {
  const { products, filteredProducts, setSearchQuery, searchQuery, filterProducts, currency } = useShop();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState("featured");
  
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    filterProducts(value === "all" ? undefined : value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Game Shop</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse our selection of premium gaming products
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={toggleFilters} className="md:hidden">
                {showFilters ? "Hide" : "Show"}
              </Button>
            </div>
            
            <div className={`space-y-6 ${showFilters || 'hidden md:block'}`}>
              <div>
                <h3 className="text-sm font-medium mb-3">Category</h3>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Price Range ({currency} {priceRange[0]} - {currency} {priceRange[1]})
                </h3>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={200}
                  step={5}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="my-6"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Sort By</h3>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                    <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                    <SelectItem value="nameAsc">Name: A to Z</SelectItem>
                    <SelectItem value="nameDesc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-shop-blue hover:bg-shop-darkBlue">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <Button variant="outline" className="sm:w-auto w-full flex items-center md:hidden" onClick={toggleFilters}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredProducts.length} products
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductGrid products={filteredProducts} />
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Shop;
