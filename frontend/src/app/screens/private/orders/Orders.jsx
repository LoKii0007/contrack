import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderFilters from "@/components/features/orders/OrderFilters";
import OrderTable from "@/components/features/orders/OrderTable";
import DeleteConfirmDialog from "@/components/features/orders/DeleteConfirmDialog";
import AddPaymentModal from "@/components/features/orders/AddPaymentModal";
import { Plus } from "lucide-react";
import { useGetOrders, useDeleteOrder } from "@/components/react-queries/orderQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";

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
    <PageLayout
      heading="Orders"
      description="Manage customer orders and track payments"
    >
      {/* Content */}
      <div className="flex-1 w-full h-full space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filters */}
          <OrderFilters
            searchQuery={searchQuery}
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <div className="flex justify-end">
            <Button onClick={() => navigate("/orders/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">

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
    </PageLayout>
  );
};

export default Orders;
