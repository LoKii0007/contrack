import React, { useState } from "react";
import ProductFilters from "@/components/features/products/ProductFilters";
import ProductTable from "@/components/features/products/ProductTable";
import ProductFormModal from "@/components/features/products/ProductFormModal";
import DeleteConfirmDialog from "@/components/features/products/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import {
  useGetProducts,
  useDeleteProduct,
} from "@/components/react-queries/productQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";

const Products = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  });

  const { data: products, isLoading } = useGetProducts();
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
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) return <Loader />;

  return (
    <PageLayout heading="Products" description="Manage your product inventory">
      {/* Content */}
      <div className="flex-1 w-full h-full space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filters */}
          <ProductFilters
            searchQuery={searchQuery}
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <div className="flex justify-end">
            <ProductFormModal>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </ProductFormModal>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">
          <ProductTable
            products={products?.data || []}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </div>
      </div>

      {/* Modals remain unchanged */}
      <ProductFormModal
        product={selectedProduct}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name}
      />
    </PageLayout>
  );
};

export default Products;
