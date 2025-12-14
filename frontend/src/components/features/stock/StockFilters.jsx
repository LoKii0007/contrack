import React, { useEffect, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StockFilters = ({ searchQuery, filters, onSearch, onFilterChange }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearch]);

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
    <div className="rounded-xl bg-card p-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stock by supplier or description..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Order Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 min-w-[140px] justify-between"
              >
                {getStatusLabel(filters.orderStatus)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["all", "pending", "completed", "cancelled"].map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleOrderStatusChange(value)}
                  className="flex items-center justify-between"
                >
                  {getStatusLabel(value)}
                  {filters.orderStatus === value && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Payment Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 min-w-[160px] justify-between"
              >
                {getPaymentStatusLabel(filters.paymentStatus)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["all", "pending", "paid", "partially_paid", "failed"].map(
                (value) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => handlePaymentStatusChange(value)}
                    className="flex items-center justify-between"
                  >
                    {getPaymentStatusLabel(value)}
                    {filters.paymentStatus === value && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Payment Method Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 min-w-[140px] justify-between"
              >
                {getPaymentMethodLabel(filters.paymentMethod)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["all", "cash", "online", "other"].map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handlePaymentMethodChange(value)}
                  className="flex items-center justify-between"
                >
                  {getPaymentMethodLabel(value)}
                  {filters.paymentMethod === value && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default StockFilters;


