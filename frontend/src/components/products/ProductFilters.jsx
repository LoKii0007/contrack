import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProductFilters = ({ searchQuery, filters, onSearch, onFilterChange }) => {
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

  const handleCategoryChange = (value) => {
    onFilterChange({ ...filters, category: value });
  };

  const handleStatusChange = (value) => {
    onFilterChange({ ...filters, status: value });
  };

  const getCategoryLabel = (value) => {
    const categoryMap = {
      all: "All Categories",
      Electronics: "Electronics",
      Accessories: "Accessories",
      Furniture: "Furniture",
      Clothing: "Clothing",
    };
    return categoryMap[value] || "All Categories";
  };

  const getStatusLabel = (value) => {
    const statusMap = {
      all: "All Status",
      active: "Active",
      inactive: "Inactive",
    };
    return statusMap[value] || "All Status";
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products by name or SKU..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[140px] justify-between">
                {getCategoryLabel(filters.category)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handleCategoryChange("all")}
                className="flex items-center justify-between"
              >
                All Categories
                {filters.category === "all" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Electronics")}
                className="flex items-center justify-between"
              >
                Electronics
                {filters.category === "Electronics" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Accessories")}
                className="flex items-center justify-between"
              >
                Accessories
                {filters.category === "Accessories" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Furniture")}
                className="flex items-center justify-between"
              >
                Furniture
                {filters.category === "Furniture" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Clothing")}
                className="flex items-center justify-between"
              >
                Clothing
                {filters.category === "Clothing" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[140px] justify-between">
                {getStatusLabel(filters.status)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handleStatusChange("all")}
                className="flex items-center justify-between"
              >
                All Status
                {filters.status === "all" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("active")}
                className="flex items-center justify-between"
              >
                Active
                {filters.status === "active" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("inactive")}
                className="flex items-center justify-between"
              >
                Inactive
                {filters.status === "inactive" && (
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

export default ProductFilters;

