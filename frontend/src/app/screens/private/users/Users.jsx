import React, { useState } from "react";
import UserFilters from "@/components/features/users/UserFilters";
import UserTable from "@/components/features/users/UserTable";
import UserFormModal from "@/components/features/users/UserFormModal";
import DeleteConfirmDialog from "@/components/features/users/DeleteConfirmDialog";
import { Plus } from "lucide-react";
import { useGetCustomers, useDeleteCustomer, useUpdateCustomer } from "@/components/react-queries/userQueries";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";

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
    <PageLayout
      heading="Users"
      description="Manage your users"
    >
      {/* Content */}
      <div className="flex-1 w-full h-full space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filters */}
          <UserFilters
            searchQuery={searchQuery}
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <div className="flex justify-end">
            <UserFormModal>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </UserFormModal>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">

        {/* Users Table */}
        <UserTable
          users={usersData?.data || []}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
        </div>
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
    </PageLayout>
  );
};

export default Users;
