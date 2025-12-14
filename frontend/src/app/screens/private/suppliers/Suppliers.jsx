import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierFilters from "@/components/features/suppliers/SupplierFilters";
import SupplierTable from "@/components/features/suppliers/SupplierTable";
import DeleteConfirmDialog from "@/components/features/suppliers/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import {
  useGetSuppliers,
  useDeleteSupplier,
} from "@/components/react-queries/supplierQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";

const Suppliers = () => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: suppliersData, isLoading } = useGetSuppliers({
    search: searchQuery || undefined,
  });
  const { mutate: deleteSupplier } = useDeleteSupplier();

  const handleEditSupplier = (supplier) => {
    navigate(`/suppliers/${supplier._id}/edit`);
  };

  const handleDeleteSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier._id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedSupplier(null);
        },
      });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (isLoading) return <Loader />;

  return (
    <PageLayout
      heading="Suppliers"
      description="Manage your suppliers"
    >
      {/* Content */}
      <div className="flex-1 w-full h-full space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filters */}
          <SupplierFilters
            searchQuery={searchQuery}
            onSearch={handleSearch}
          />

          <div className="flex justify-end">
            <Button onClick={() => navigate("/suppliers/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">

        <SupplierTable
          suppliers={suppliersData?.data || []}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSupplier(null);
        }}
        onConfirm={handleConfirmDelete}
        supplierName={selectedSupplier?.name}
      />
    </PageLayout>
  );
};

export default Suppliers;


