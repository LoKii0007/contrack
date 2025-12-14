import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StockFilters from "@/components/features/stock/StockFilters";
import StockTable from "@/components/features/stock/StockTable";
import DeleteConfirmDialog from "@/components/features/stock/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import { useGetStocks, useDeleteStock } from "@/components/react-queries/stockQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";

const StockPage = () => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    orderStatus: "all",
    paymentStatus: "all",
    paymentMethod: "all",
  });

  const queryParams = {
    search: searchQuery || undefined,
    ...(filters.orderStatus !== "all" && { orderStatus: filters.orderStatus }),
    ...(filters.paymentStatus !== "all" && { paymentStatus: filters.paymentStatus }),
    ...(filters.paymentMethod !== "all" && { paymentMethod: filters.paymentMethod }),
  };

  const { data: stocksData, isLoading } = useGetStocks(queryParams);
  const { mutate: deleteStock } = useDeleteStock();

  const handleEditStock = (stock) => {
    navigate(`/stock/${stock._id}/edit`);
  };

  const handleDeleteStock = (stock) => {
    setSelectedStock(stock);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStock) {
      deleteStock(selectedStock._id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedStock(null);
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

  return (
    <PageLayout
      heading="Stock"
      description="Manage stock purchases from suppliers"
    >
      {/* Content */}
      <div className="flex-1 w-full h-full space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filters */}
          <StockFilters
            searchQuery={searchQuery}
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <div className="flex justify-end">
            <Button onClick={() => navigate("/stock/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock Entry
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">

        {isLoading ? (
          <Loader />
        ) : (
          <StockTable
            stocks={stocksData?.data || []}
            onEdit={handleEditStock}
            onDelete={handleDeleteStock}
          />
        )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedStock(null);
        }}
        onConfirm={handleConfirmDelete}
        stockInfo={selectedStock?.supplier?.name || selectedStock?._id}
      />
    </PageLayout>
  );
};

export default StockPage;