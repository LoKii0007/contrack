import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetSuppliers,
  useUpdateSupplier,
} from "@/components/react-queries/supplierQueries";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/Loader";

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: suppliersData, isLoading } = useGetSuppliers();
  const { mutate: updateSupplier, isPending: isUpdating } = useUpdateSupplier();

  const supplier =
    suppliersData?.data?.find((s) => s._id === id) || null;

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
    if (supplier) {
      const addr = supplier.addresses && supplier.addresses[0]
        ? supplier.addresses[0]
        : {
            streetAddress: "",
            streetAddress2: "",
            city: "",
            state: "",
            postalCode: "",
          };

      setFormData({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        streetAddress: addr.streetAddress || "",
        streetAddress2: addr.streetAddress2 || "",
        city: addr.city || "",
        state: addr.state || "",
        postalCode: addr.postalCode || "",
      });
    }
  }, [supplier]);

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
      addresses: [
        {
          streetAddress: formData.streetAddress || undefined,
          streetAddress2: formData.streetAddress2 || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          postalCode: formData.postalCode || undefined,
        },
      ],
    };

    updateSupplier(
      { supplierId: id, supplierData: payload },
      {
        onSuccess: () => {
          navigate("/suppliers");
        },
      }
    );
  };

  if (isLoading) return <Loader />;
  if (!supplier) return <div>Supplier not found</div>;

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/suppliers")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Edit Supplier
            </h1>
            <p className="text-sm text-muted-foreground">
              Update supplier information
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
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
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="Street address"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="streetAddress2">Street Address 2</Label>
                <Input
                  id="streetAddress2"
                  name="streetAddress2"
                  value={formData.streetAddress2}
                  onChange={handleChange}
                  placeholder="Street address 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-card p-6 shadow-lg">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/suppliers")}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating} size="lg">
            {isUpdating ? "Updating Supplier..." : "Update Supplier"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplier;


