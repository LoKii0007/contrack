import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const UserFilters = ({ searchQuery, filters, onSearch, onFilterChange }) => {
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

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
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

          {/* City Filter */}
          <Input
            type="text"
            placeholder="City"
            value={filters.city || ""}
            onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
            className="w-32"
          />

          {/* State Filter */}
          <Input
            type="text"
            placeholder="State"
            value={filters.state || ""}
            onChange={(e) => onFilterChange({ ...filters, state: e.target.value })}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default UserFilters;

