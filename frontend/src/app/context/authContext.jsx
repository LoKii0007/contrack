import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useLoginTenant,
  useRegisterTenant,
  useGetTenantProfile,
  getToken,
  getTenant,
  removeToken,
  removeTenant,
} from "@/components/react-queries/authQueries";
import { toast } from "sonner";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get admin profile query - automatically refetches when token exists
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
  } = useGetTenantProfile();

  // Login mutation
  const loginMutation = useLoginTenant();

  // Register mutation
  const registerMutation = useRegisterTenant();

  // Derived state
  const token = getToken();
  const tenantFromStorage = getTenant();
  const tenant = profileData?.data || tenantFromStorage;
  const isAuthenticated = !!token && !!tenant && !isProfileError;

  // Initialize auth state
  useEffect(() => {
    if (token && !isLoadingProfile) {
      setIsInitialized(true);
    } else if (!token) {
      setIsInitialized(true);
    }
  }, [token, isLoadingProfile]);

  // Handle 401 errors from profile query
  useEffect(() => {
    if (isProfileError && profileError?.response?.status === 401) {
      // Token is invalid, clear everything
      removeToken();
      removeTenant();
      queryClient.clear();
    }
  }, [isProfileError, profileError, queryClient]);

  // Login function
  const login = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // Token and admin are set in the mutation's onSuccess
      // The profile query will automatically refetch
    } catch (error) {
      // Error is already handled in the mutation's onError
      throw error;
    }
  };

  // Register function
  const register = async (tenantData) => {
    try {
      await registerMutation.mutateAsync(tenantData);
      // Navigation is handled in the mutation's onSuccess
    } catch (error) {
      // Error is already handled in the mutation's onError
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    removeTenant();
    queryClient.clear();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  // Loading state - true if checking auth status or logging in
  const isLoading = isLoadingProfile || loginMutation.isPending || !isInitialized;

  const value = {
    // State
    isAuthenticated,
    tenant,
    token,
    isLoading,
    isInitialized,
    
    // Actions
    login,
    logout,
    register,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

