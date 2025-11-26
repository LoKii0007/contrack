import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OrderFilters = ({ searchQuery, filters, onSearch, onFilterChange }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearchQuery);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearch]);

  // Sync local state with prop when it changes externally
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleOrderStatusChange = (value) => {
    onFilterChange({ ...filters, orderStatus: value });
  };

  const handlePaymentStatusChange = (value) => {
    onFilterChange({ ...filters, paymentStatus: value });
  };

  const handlePaymentMethodChange = (value) => {
    onFilterChange({ ...filters, paymentMethod: value });
  };

  const getStatusLabel = (value) => {
    const statusMap = {
      all: "All Status",
      pending: "Pending",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return statusMap[value] || "All Status";
  };

  const getPaymentStatusLabel = (value) => {
    const statusMap = {
      all: "All Payments",
      pending: "Payment Pending",
      paid: "Paid",
      partially_paid: "Partially Paid",
      failed: "Failed",
    };
    return statusMap[value] || "All Payments";
  };

  const getPaymentMethodLabel = (value) => {
    const methodMap = {
      all: "All Methods",
      cash: "Cash",
      online: "Online",
      other: "Other",
    };
    return methodMap[value] || "All Methods";
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search orders by email or description..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Order Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[140px] justify-between">
                {getStatusLabel(filters.orderStatus)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handleOrderStatusChange("all")}
                className="flex items-center justify-between"
              >
                All Status
                {filters.orderStatus === "all" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOrderStatusChange("pending")}
                className="flex items-center justify-between"
              >
                Pending
                {filters.orderStatus === "pending" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOrderStatusChange("completed")}
                className="flex items-center justify-between"
              >
                Completed
                {filters.orderStatus === "completed" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOrderStatusChange("cancelled")}
                className="flex items-center justify-between"
              >
                Cancelled
                {filters.orderStatus === "cancelled" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Payment Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[140px] justify-between">
                {getPaymentStatusLabel(filters.paymentStatus)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handlePaymentStatusChange("all")}
                className="flex items-center justify-between"
              >
                All Payments
                {filters.paymentStatus === "all" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePaymentStatusChange("pending")}
                className="flex items-center justify-between"
              >
                Payment Pending
                {filters.paymentStatus === "pending" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePaymentStatusChange("paid")}
                className="flex items-center justify-between"
              >
                Paid
                {filters.paymentStatus === "paid" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePaymentStatusChange("partially_paid")}
                className="flex items-center justify-between"
              >
                Partially Paid
                {filters.paymentStatus === "partially_paid" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePaymentStatusChange("failed")}
                className="flex items-center justify-between"
              >
                Failed
                {filters.paymentStatus === "failed" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Payment Method Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[140px] justify-between">
                {getPaymentMethodLabel(filters.paymentMethod)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handlePaymentMethodChange("all")}
                className="flex items-center justify-between"
              >
                All Methods
                {filters.paymentMethod === "all" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePaymentMethodChange("cash")}
                className="flex items-center justify-between"
              >
                Cash
                {filters.paymentMethod === "cash" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePaymentMethodChange("online")}
                className="flex items-center justify-between"
              >
                Online
                {filters.paymentMethod === "online" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePaymentMethodChange("other")}
                className="flex items-center justify-between"
              >
                Other
                {filters.paymentMethod === "other" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;

