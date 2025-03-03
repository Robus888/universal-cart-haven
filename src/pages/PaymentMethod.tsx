
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import PaymentMethodsDropdown from "@/components/payment/PaymentMethodsDropdown";
import { motion } from "framer-motion";

const PaymentMethod: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white p-6">
            <CardContent className="pt-6">
              <PaymentMethodsDropdown fullPage={true} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PaymentMethod;
