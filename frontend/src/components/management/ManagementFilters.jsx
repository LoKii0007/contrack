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

const ManagementFilters = ({ searchQuery, filters, onSearch, onFilterChange }) => {
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

  const handleRoleChange = (value) => {
    onFilterChange({ ...filters, role: value });
  };

  const handleVerifiedChange = (value) => {
    onFilterChange({ ...filters, isVerified: value });
  };

  const getRoleLabel = (value) => {
    const roleMap = {
      all: "All Roles",
      admin: "Admin",
      manager: "Manager",
      staff: "Staff",
    };
    return roleMap[value] || "All Roles";
  };

  const getVerifiedLabel = (value) => {
    const verifiedMap = {
      all: "All Status",
      true: "Verified",
      false: "Not Verified",
    };
    return verifiedMap[value] || "All Status";
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email..."
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

          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[140px] justify-between">
                {getRoleLabel(filters.role)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handleRoleChange("all")}
                className="flex items-center justify-between"
              >
                All Roles
                {filters.role === "all" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("admin")}
                className="flex items-center justify-between"
              >
                Admin
                {filters.role === "admin" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("manager")}
                className="flex items-center justify-between"
              >
                Manager
                {filters.role === "manager" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("staff")}
                className="flex items-center justify-between"
              >
                Staff
                {filters.role === "staff" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Verified Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[140px] justify-between">
                {getVerifiedLabel(filters.isVerified)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handleVerifiedChange("all")}
                className="flex items-center justify-between"
              >
                All Status
                {filters.isVerified === "all" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedChange("true")}
                className="flex items-center justify-between"
              >
                Verified
                {filters.isVerified === "true" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedChange("false")}
                className="flex items-center justify-between"
              >
                Not Verified
                {filters.isVerified === "false" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ManagementFilters;

