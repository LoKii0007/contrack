import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import baseApi from "@/lib/axios";
import { toast } from "sonner";

// Fetch all tenant admins with pagination and filters
export const useGetTenantAdmins = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.search) queryParams.append("search", params.search);
  if (params.phone) queryParams.append("phone", params.phone);
  if (params.email) queryParams.append("email", params.email);
  if (params.role) queryParams.append("role", params.role);
  if (params.isVerified !== undefined) queryParams.append("isVerified", params.isVerified);

  return useQuery({
    queryKey: ["tenantAdmins", params],
    queryFn: async () => {
      const { data } = await baseApi.get(`/tenant-admin?${queryParams.toString()}`);
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch tenant admins");
    },
  });
};

// Fetch a single tenant admin by ID
export const useGetTenantAdminById = (tenantAdminId) => {
  return useQuery({
    queryKey: ["tenantAdmin", tenantAdminId],
    queryFn: async () => {
      const { data } = await baseApi.get(`/tenant-admin/${tenantAdminId}`);
      return data;
    },
    enabled: !!tenantAdminId,
  });
};

// Create a new tenant admin
export const useCreateTenantAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantAdminData) => {
      const { data } = await baseApi.post("/tenant-admin", tenantAdminData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantAdmins"] });
      toast.success("Tenant admin created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create tenant admin");
    },
  });
};

// Update a tenant admin
export const useUpdateTenantAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenantAdminId, tenantAdminData }) => {
      const { data } = await baseApi.put(`/tenant-admin/${tenantAdminId}`, tenantAdminData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantAdmins"] });
      queryClient.invalidateQueries({ queryKey: ["tenantAdmin"] });
      toast.success("Tenant admin updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update tenant admin");
    },
  });
};

// Delete a tenant admin
export const useDeleteTenantAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantAdminId) => {
      const { data } = await baseApi.delete(`/tenant-admin/${tenantAdminId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantAdmins"] });
      toast.success("Tenant admin deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete tenant admin");
    },
  });
};

