import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import baseApi from "@/lib/axios";
import { toast } from "sonner";

// Token management utilities
export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

export const getTenant = () => {
  const tenant = localStorage.getItem("tenant");
  return tenant ? JSON.parse(tenant) : null;
};

export const setTenant = (tenant) => {
  localStorage.setItem("tenant", JSON.stringify(tenant));
};

export const removeTenant = () => {
  localStorage.removeItem("tenant");
};

// Admin registration mutation
export const useRegisterTenant = () => {
  return useMutation({
    mutationFn: async (tenantData) => {
      const { data } = await baseApi.post("/tenant/register", tenantData);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Registered successfully");
      // Navigate to login after successful registration
      window.location.href = "/login";
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to register"
      );
    },
  });
};

// Admin login mutation
export const useLoginTenant = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await baseApi.post("/tenant/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      const { token, tenant } = data.data;
      
      // Store token and admin data
      setToken(token);
      setTenant(tenant);
      
      toast.success(data.message || "Login successful");
      
      // Navigate to dashboard after successful login
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to login"
      );
    },
  });
};

// Get admin profile query
export const useGetTenantProfile = () => {
  return useQuery({
    queryKey: ["tenant", "profile"],
    queryFn: async () => {
      const { data } = await baseApi.get("/tenant/profile");
      return data;
    },
    enabled: !!getToken(), // Only run if token exists
    retry: false,
  });
};

// Logout function hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    removeTenant();
    queryClient.clear();
    window.location.href = "/login";
    toast.success("Logged out successfully");
  };
};

