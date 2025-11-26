import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderFilters from "@/components/orders/OrderFilters";
import OrderTable from "@/components/orders/OrderTable";
import DeleteConfirmDialog from "@/components/orders/DeleteConfirmDialog";
import AddPaymentModal from "@/components/orders/AddPaymentModal";
import { Plus } from "lucide-react";
import { useGetOrders, useDeleteOrder } from "@/react-queries/orderQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    orderStatus: "all",
    paymentStatus: "all",
    paymentMethod: "all",
  });

  // Build filter params for API
  const filterParams = {
    search: searchQuery,
    ...(filters.orderStatus !== "all" && { orderStatus: filters.orderStatus }),
    ...(filters.paymentStatus !== "all" && {
      paymentStatus: filters.paymentStatus,
    }),
    ...(filters.paymentMethod !== "all" && {
      paymentMethod: filters.paymentMethod,
    }),
  };

  const { data: ordersData, isLoading } = useGetOrders(filterParams);
  const { mutate: deleteOrder } = useDeleteOrder();

  const orders = ordersData?.data || [];

  const handleEditOrder = (order) => {
    navigate(`/orders/${order._id}/edit`);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOrder) {
      deleteOrder(selectedOrder._id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedOrder(null);
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

  const handleViewOrder = (order) => {
    navigate(`/orders/${order._id}/view`);
  };

  const handleAddPayment = (order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="h-full max-h-screen overflow-y-auto">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Orders
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage customer orders and track payments
            </p>
          </div>
          <Button onClick={() => navigate("/orders/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Filters */}
        <OrderFilters
          searchQuery={searchQuery}
          filters={filters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Orders Table */}
        {isLoading ? (
          <Loader />
        ) : (
          <OrderTable
            orders={orders}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onView={handleViewOrder}
            onAddPayment={handleAddPayment}
          />
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmDelete}
        orderInfo={selectedOrder?.user?.name || selectedOrder?.email}
      />

      {/* Add Payment Modal */}
      <AddPaymentModal
        order={selectedOrder}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default Orders;
