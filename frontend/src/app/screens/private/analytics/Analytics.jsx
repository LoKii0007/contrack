import React, { useState } from "react";
import ProductAnalytics from "@/components/features/analytics/ProductAnalytics";
import CustomerAnalytics from "@/components/features/analytics/CustomerAnalytics";
import OrderAnalytics from "@/components/features/analytics/OrderAnalytics";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageLayout from "@/layouts/PageLayout";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <PageLayout
      heading="Analytics"
      description="View detailed analytics for products, customers, and orders"
      className="overflow-y-auto"
    >
      {/* Content */}
      <div className="flex-1 w-full h-full ">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 p-0 shadow-none h-auto border" >
            <TabsTrigger classNam="" value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="h-fit mt-0">
            <ProductAnalytics />
          </TabsContent>
          <TabsContent value="customers" className="h-fit mt-0">
            <CustomerAnalytics />
          </TabsContent>
          <TabsContent value="orders" className="h-fit mt-0">
            <OrderAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Analytics;
