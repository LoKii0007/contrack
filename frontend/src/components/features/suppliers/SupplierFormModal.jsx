import React, { useEffect, useState } from "react";
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
import { useCreateSupplier, useUpdateSupplier } from "@/components/react-queries/supplierQueries";

const SupplierFormModal = ({
  children,
  supplier,
  onSuccess,
  open: externalOpen,
  onOpenChange,
}) => {
  const { mutate: createSupplier, isPending: isCreating } = useCreateSupplier();
  const { mutate: updateSupplier, isPending: isUpdating } = useUpdateSupplier();

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [
      {
        streetAddress: "",
        streetAddress2: "",
        city: "",
        state: "",
        postalCode: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        addresses:
          supplier.addresses && supplier.addresses.length > 0
            ? supplier.addresses
            : [
                {
                  streetAddress: "",
                  streetAddress2: "",
                  city: "",
                  state: "",
                  postalCode: "",
                },
              ],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        addresses: [
          {
            streetAddress: "",
            streetAddress2: "",
            city: "",
            state: "",
            postalCode: "",
          },
        ],
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      addresses: [
        {
          ...prev.addresses[0],
          [name]: value,
        },
      ],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      addresses: formData.addresses,
    };

    if (supplier) {
      updateSupplier(
        { supplierId: supplier._id, supplierData: payload },
        {
          onSuccess: () => {
            setIsOpen(false);
            if (onSuccess) onSuccess();
          },
        }
      );
    } else {
      createSupplier(payload, {
        onSuccess: () => {
          setIsOpen(false);
          if (onSuccess) onSuccess();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Edit Supplier" : "Add Supplier"}
          </DialogTitle>
          <DialogDescription>
            {supplier
              ? "Update supplier information"
              : "Fill in the details to add a new supplier"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Supplier name"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="supplier@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.addresses[0].streetAddress}
              onChange={handleAddressChange}
              placeholder="Street address"
              className="mb-2"
            />
            <Input
              id="streetAddress2"
              name="streetAddress2"
              value={formData.addresses[0].streetAddress2}
              onChange={handleAddressChange}
              placeholder="Street address 2"
              className="mb-2"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                id="city"
                name="city"
                value={formData.addresses[0].city}
                onChange={handleAddressChange}
                placeholder="City"
              />
              <Input
                id="state"
                name="state"
                value={formData.addresses[0].state}
                onChange={handleAddressChange}
                placeholder="State"
              />
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.addresses[0].postalCode}
                onChange={handleAddressChange}
                placeholder="Postal code"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? "Saving..."
                : supplier
                ? "Update Supplier"
                : "Add Supplier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierFormModal;


