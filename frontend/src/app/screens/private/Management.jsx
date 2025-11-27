import React, { useState } from "react";
import ManagementFilters from "@/components/features/management/ManagementFilters";
import ManagementTable from "@/components/features/management/ManagementTable";
import ManagementFormModal from "@/components/features/management/ManagementFormModal";
import DeleteConfirmDialog from "@/components/features/management/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import { useGetTenantAdmins, useDeleteTenantAdmin } from "@/components/react-queries/tenantAdminQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

const Management = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenantAdmin, setSelectedTenantAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    isVerified: "all",
  });

  // Build query params
  const queryParams = {
    ...(searchQuery && { search: searchQuery }),
    ...(filters.role !== "all" && { role: filters.role }),
    ...(filters.isVerified !== "all" && { isVerified: filters.isVerified }),
  };

  const { data: tenantAdminsData, isLoading } = useGetTenantAdmins(queryParams);
  const { mutate: deleteTenantAdmin } = useDeleteTenantAdmin();

  const handleEditTenantAdmin = (tenantAdmin) => {
    setSelectedTenantAdmin(tenantAdmin);
    setIsEditModalOpen(true);
  };

  const handleDeleteTenantAdmin = (tenantAdmin) => {
    setSelectedTenantAdmin(tenantAdmin);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTenantAdmin) {
      deleteTenantAdmin(selectedTenantAdmin._id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedTenantAdmin(null);
        },
      });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="h-full">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your tenant admins
            </p>
          </div>
          <ManagementFormModal>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant Admin
            </Button>
          </ManagementFormModal>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Filters */}
        <ManagementFilters
          searchQuery={searchQuery}
          filters={filters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Tenant Admins Table */}
        <ManagementTable
          tenantAdmins={tenantAdminsData?.data || []}
          onEdit={handleEditTenantAdmin}
          onDelete={handleDeleteTenantAdmin}
        />
      </div>

      {/* Edit Tenant Admin Modal */}
      <ManagementFormModal
        tenantAdmin={selectedTenantAdmin}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setSelectedTenantAdmin(null);
        }}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTenantAdmin(null);
        }}
        onConfirm={handleConfirmDelete}
        tenantAdminName={selectedTenantAdmin?.name}
      />
    </div>
  );
};

export default Management;