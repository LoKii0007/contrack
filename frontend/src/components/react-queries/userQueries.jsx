import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import baseApi from "@/lib/axios";
import { toast } from "sonner";

// Fetch all users with pagination and filters
export const useGetCustomers = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.search) queryParams.append("search", params.search);
  if (params.phone) queryParams.append("phone", params.phone);
  if (params.email) queryParams.append("email", params.email);
  if (params.city) queryParams.append("city", params.city);
  if (params.state) queryParams.append("state", params.state);

  return useQuery({
    queryKey: ["customers", params],
    queryFn: async () => {
      const { data } = await baseApi.get(`/customers?${queryParams.toString()}`);
      return data;
    },
  });
};

// Fetch a single user by ID
export const useGetCustomerById = (userId) => {
  return useQuery({
    queryKey: ["customer", userId],
    queryFn: async () => {
      const { data } = await baseApi.get(`/customers/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

// Create a new user
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await baseApi.post("/customers", userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create customer");
    },
  });
};

// Update a user
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }) => {
      const { data } = await baseApi.put(`/customers/${userId}`, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

// Delete a user
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await baseApi.delete(`/customers/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    },
  });
};

// Get user by email
export const useGetCustomerByEmail = (email) => {
  return useQuery({
    queryKey: ["customer", "email", email],
    queryFn: async () => {
      const { data } = await baseApi.get(`/customers/email/${email}`);
      return data;
    },
    enabled: !!email,
  });
};

// Get user by phone
export const useGetCustomerByPhone = (phone) => {
  return useQuery({
    queryKey: ["customer", "phone", phone],
    queryFn: async () => {
      const { data } = await baseApi.get(`/customers/phone/${phone}`);
      return data;
    },
    enabled: !!phone,
  });
};

// Get user statistics
export const useGetCustomerStatistics = () => {
  return useQuery({
    queryKey: ["customers", "statistics"],
    queryFn: async () => {
      const { data } = await baseApi.get("/customers/statistics");
      return data;
    },
  });
};

