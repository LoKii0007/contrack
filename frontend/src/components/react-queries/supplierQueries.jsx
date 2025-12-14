import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import baseApi from "@/lib/axios";
import { toast } from "sonner";

export const useGetSuppliers = (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.search) queryParams.append("search", params.search);
  if (params.phone) queryParams.append("phone", params.phone);
  if (params.email) queryParams.append("email", params.email);

  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: async () => {
      const { data } = await baseApi.get(`/suppliers?${queryParams.toString()}`);
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch suppliers");
    },
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierData) => {
      const { data } = await baseApi.post("/suppliers", supplierData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create supplier");
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ supplierId, supplierData }) => {
      const { data } = await baseApi.put(`/suppliers/${supplierId}`, supplierData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update supplier");
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierId) => {
      const { data } = await baseApi.delete(`/suppliers/${supplierId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    },
  });
};


