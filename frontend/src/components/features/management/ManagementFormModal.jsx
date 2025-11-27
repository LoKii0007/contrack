import React, { useState, useEffect } from "react";
import { useCreateTenantAdmin, useUpdateTenantAdmin } from "@/components/react-queries/tenantAdminQueries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const ManagementFormModal = ({
  children,
  tenantAdmin,
  onSuccess,
  open: externalOpen,
  onOpenChange,
}) => {
  const { mutate: createTenantAdmin, isPending: isCreating } = useCreateTenantAdmin();
  const { mutate: updateTenantAdmin, isPending: isUpdating } = useUpdateTenantAdmin();
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external open state if provided (for edit mode), otherwise use internal state (for create mode)
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "manager",
    isVerified: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tenantAdmin) {
      setFormData({
        name: tenantAdmin.name || "",
        email: tenantAdmin.email || "",
        phone: tenantAdmin.phone ? String(tenantAdmin.phone) : "",
        password: "",
        role: tenantAdmin.role || "manager",
        isVerified: tenantAdmin.isVerified || false,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "manager",
        isVerified: false,
      });
    }
    setErrors({});
  }, [tenantAdmin, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10-15 digits";
    }
    if (!tenantAdmin && !formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = { ...formData };
      // Convert phone to number
      submitData.phone = Number(submitData.phone);
      // Don't send password if it's empty (for updates)
      if (tenantAdmin && !submitData.password) {
        delete submitData.password;
      }

      if (tenantAdmin) {
        updateTenantAdmin(
          {
            tenantAdminId: tenantAdmin._id,
            tenantAdminData: submitData,
          },
          {
            onSuccess: () => {
              setIsOpen(false);
              if (onSuccess) onSuccess();
            },
          }
        );
      } else {
        createTenantAdmin(submitData, {
          onSuccess: () => {
            setIsOpen(false);
            if (onSuccess) onSuccess();
          },
        });
      }
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tenantAdmin ? "Edit Tenant Admin" : "Add New Tenant Admin"}
          </DialogTitle>
          <DialogDescription>
            {tenantAdmin
              ? "Update tenant admin information"
              : "Fill in the details to create a new tenant admin"}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={!!errors.phone}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {!tenantAdmin && <span className="text-destructive">*</span>}
                {tenantAdmin && <span className="text-xs text-muted-foreground">(leave blank to keep current)</span>}
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                placeholder={tenantAdmin ? "Enter new password" : "Enter password"}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger
                  id="role"
                  aria-invalid={!!errors.role}
                  className="w-full"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>

            {/* Is Verified */}
            <div className="md:col-span-2 flex items-center justify-between space-x-2 rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isVerified">Verification Status</Label>
                <p className="text-xs text-muted-foreground">
                  Mark this tenant admin as verified
                </p>
              </div>
              <Switch
                id="isVerified"
                checked={formData.isVerified}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isVerified: checked }))
                }
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : tenantAdmin
                ? "Update Tenant Admin"
                : "Create Tenant Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManagementFormModal;

