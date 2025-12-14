import { useQuery } from "@tanstack/react-query";
import baseApi from "@/lib/axios";
import { toast } from "sonner";

/**
 * Get product sales analytics
 */
export const useGetProductSalesAnalytics = (filters = {}) => {
  return useQuery({
    queryKey: ["analytics", "products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          params.append(key, value);
        }
      });
      const response = await baseApi.get(`/analytics/products?${params.toString()}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch product analytics");
    },
  });
};

/**
 * Get customer sales analytics
 */
export const useGetCustomerSalesAnalytics = (filters = {}) => {
  return useQuery({
    queryKey: ["analytics", "customers", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          params.append(key, value);
        }
      });
      const response = await baseApi.get(`/analytics/customers?${params.toString()}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch customer analytics");
    },
  });
};

/**
 * Get order analytics
 */
export const useGetOrderAnalytics = (filters = {}) => {
  return useQuery({
    queryKey: ["analytics", "orders", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          params.append(key, value);
        }
      });
      const response = await baseApi.get(`/analytics/orders?${params.toString()}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch order analytics");
    },
  });
};

