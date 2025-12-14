import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import baseApi from "@/lib/axios";
import { toast } from "sonner";

export const useGetStocks = (filters = {}) => {
  return useQuery({
    queryKey: ["stocks", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });
      const response = await baseApi.get(`/stocks?${params.toString()}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch stocks");
    },
  });
};

export const useGetStockById = (stockId) => {
  return useQuery({
    queryKey: ["stocks", stockId],
    queryFn: async () => {
      const response = await baseApi.get(`/stocks/${stockId}`);
      return response.data;
    },
    enabled: !!stockId,
    onError: (error) => {
      toast.error(error.message || "Failed to fetch stock entry");
    },
  });
};

export const useCreateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stockData) => {
      const response = await baseApi.post("/stocks", stockData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock entry created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create stock entry");
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...stockData }) => {
      const response = await baseApi.put(`/stocks/${id}`, stockData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock entry updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update stock entry");
    },
  });
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stockId) => {
      const response = await baseApi.delete(`/stocks/${stockId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock entry deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete stock entry");
    },
  });
};


