import React, { useState } from "react";
import ProductFilters from "@/components/features/products/ProductFilters";
import ProductTable from "@/components/features/products/ProductTable";
import ProductFormModal from "@/components/features/products/ProductFormModal";
import DeleteConfirmDialog from "@/components/features/products/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import { useGetProducts, useDeleteProduct } from "@/components/react-queries/productQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  });

  const { data: products, isLoading} = useGetProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct._id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedProduct(null);
        },
      });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: Implement search logic or API call
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // TODO: Implement filter logic or API call
  };

  if (isLoading) return <Loader />;

  return (
    <div className="h-full">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Products
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <ProductFormModal>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </ProductFormModal>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Filters */}
        <ProductFilters
          searchQuery={searchQuery}
          filters={filters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Products Table */}
        <ProductTable
          products={products?.data || []}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* Edit Product Modal */}
      <ProductFormModal
        product={selectedProduct}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name}
      />
    </div>
  );
};

export default Products;
