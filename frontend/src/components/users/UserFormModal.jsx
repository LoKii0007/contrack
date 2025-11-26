import React, { useState, useEffect } from "react";
import { useCreateCustomer, useUpdateCustomer } from "@/react-queries/userQueries";
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

const UserFormModal = ({
  children,
  user,
  onSuccess,
  open: externalOpen,
  onOpenChange,
}) => {
  const { mutate: createUser, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateCustomer();
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external open state if provided (for edit mode), otherwise use internal state (for create mode)
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // If editing, populate form with user data
      const firstAddress = user.addresses?.[0] || {};
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        streetAddress: firstAddress.streetAddress || "",
        streetAddress2: firstAddress.streetAddress2 || "",
        city: firstAddress.city || "",
        state: firstAddress.state || "",
        postalCode: firstAddress.postalCode || "",
      });
    } else {
      // Reset form for new user
      setFormData({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        streetAddress2: "",
        city: "",
        state: "",
        postalCode: "",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
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
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phone && isNaN(formData.phone)) {
      newErrors.phone = "Phone must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const userData = {
        name: formData.name.trim(),
        ...(formData.email && { email: formData.email.trim() }),
        ...(formData.phone && { phone: Number(formData.phone) }),
      };

      // Add address if any address fields are filled
      const hasAddressFields =
        formData.streetAddress ||
        formData.streetAddress2 ||
        formData.city ||
        formData.state ||
        formData.postalCode;

      if (hasAddressFields) {
        userData.addresses = [
          {
            ...(formData.streetAddress && { streetAddress: formData.streetAddress.trim() }),
            ...(formData.streetAddress2 && { streetAddress2: formData.streetAddress2.trim() }),
            ...(formData.city && { city: formData.city.trim() }),
            ...(formData.state && { state: formData.state.trim() }),
            ...(formData.postalCode && { postalCode: formData.postalCode.trim() }),
          },
        ];
      }

      if (user) {
        // Update user
        updateUser(
          {
            userId: user._id || user.id,
            userData,
          },
          {
            onSuccess: () => {
              setIsOpen(false);
              if (onSuccess) onSuccess();
            },
          }
        );
      } else {
        // Create user
        createUser(userData, {
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
            {user ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information"
              : "Fill in the details to create a new user"}
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
                placeholder="Enter user name"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="phone">Phone</Label>
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

            {/* Address Section */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-foreground mb-4">
                Address (Optional)
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Street Address */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="Enter street address"
                  />
                </div>

                {/* Street Address 2 */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="streetAddress2">Street Address 2</Label>
                  <Input
                    type="text"
                    id="streetAddress2"
                    name="streetAddress2"
                    value={formData.streetAddress2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
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
                : user
                ? "Update User"
                : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormModal;

