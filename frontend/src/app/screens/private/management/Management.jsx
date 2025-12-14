import React, { useState } from "react";
import ManagementFilters from "@/components/features/management/ManagementFilters";
import ManagementTable from "@/components/features/management/ManagementTable";
import ManagementFormModal from "@/components/features/management/ManagementFormModal";
import DeleteConfirmDialog from "@/components/features/management/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import { useGetTenantAdmins, useDeleteTenantAdmin } from "@/components/react-queries/tenantAdminQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";

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
    <PageLayout
      heading="Management"
      description="Manage your tenant admins"
    >
      {/* Content */}
      <div className="flex-1 w-full h-full space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filters */}
          <ManagementFilters
            searchQuery={searchQuery}
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <div className="flex justify-end">
            <ManagementFormModal>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant Admin
              </Button>
            </ManagementFormModal>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">

        {/* Tenant Admins Table */}
        <ManagementTable
          tenantAdmins={tenantAdminsData?.data || []}
          onEdit={handleEditTenantAdmin}
          onDelete={handleDeleteTenantAdmin}
        />
        </div>
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
    </PageLayout>
  );
};

export default Management;