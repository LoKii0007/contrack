import React, { useState } from "react";
import UserFilters from "@/components/users/UserFilters";
import UserTable from "@/components/users/UserTable";
import UserFormModal from "@/components/users/UserFormModal";
import DeleteConfirmDialog from "@/components/users/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import { useGetCustomers, useDeleteCustomer, useUpdateCustomer } from "@/react-queries/userQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

const Users = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    state: "",
  });

  const { data: usersData, isLoading } = useGetCustomers({
    search: searchQuery || undefined,
    city: filters.city || undefined,
    state: filters.state || undefined,
  });
  const { mutate: deleteUser } = useDeleteCustomer();
  const { mutate: updateUser } = useUpdateCustomer();

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser._id || selectedUser.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
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
    <div className="h-full">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Users
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your users
            </p>
          </div>
          <UserFormModal>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </UserFormModal>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Filters */}
        <UserFilters
          searchQuery={searchQuery}
          filters={filters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Users Table */}
        <UserTable
          users={usersData?.data || []}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* Edit User Modal */}
      <UserFormModal
        user={selectedUser}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setSelectedUser(null);
        }}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name}
      />
    </div>
  );
};

export default Users;
