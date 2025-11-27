import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import baseApi from "@/lib/axios";
import { toast } from "sonner";

export const useGetOrders = (filters = {}) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });
      const response = await baseApi.get(`/orders?${params.toString()}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch orders");
    },
  });
};

export const useGetOrderById = (orderId) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await baseApi.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
    onError: (error) => {
      toast.error(error.message || "Failed to fetch order");
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData) => {
      const response = await baseApi.post("/orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...orderData }) => {
      const response = await baseApi.put(`/orders/${id}`, orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update order");
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await baseApi.delete(`/orders/${orderId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete order");
    },
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, paymentData }) => {
      const response = await baseApi.post(`/orders/${orderId}/payment`, paymentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Payment added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add payment");
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await baseApi.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update order status");
    },
  });
};

export const useGetOrdersByUser = (userId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["orders", "user", userId, page, limit],
    queryFn: async () => {
      const response = await baseApi.get(`/orders/user/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    },
    enabled: !!userId,
    onError: (error) => {
      toast.error(error.message || "Failed to fetch user orders");
    },
  });
};

