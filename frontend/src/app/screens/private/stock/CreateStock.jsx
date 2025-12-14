import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateStock } from "@/components/react-queries/stockQueries";
import { useGetProducts } from "@/components/react-queries/productQueries";
import { useGetSuppliers } from "@/components/react-queries/supplierQueries";
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
import { X, ArrowLeft } from "lucide-react";
import Loader from "@/components/Loader";

const CreateStock = () => {
  const navigate = useNavigate();
  const { mutate: createStock, isPending: isCreating } = useCreateStock();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useGetSuppliers({ limit: 100 });

  const products = productsData?.data || [];
  const suppliers = suppliersData?.data || [];

  const [formData, setFormData] = useState({
    supplier: "",
    total: 0,
    description: "",
    phone: "",
    email: "",
    paymentMethod: "cash",
    orderStatus: "pending",
    paymentStatus: "pending",
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

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

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSupplierChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      supplier: value,
    }));
    if (errors.supplier) {
      setErrors((prev) => ({
        ...prev,
        supplier: "",
      }));
    }
  };

  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product && !selectedProducts.find((p) => p.product._id === productId)) {
      const newProduct = {
        product: {
          _id: product._id,
          name: product.name,
        },
        quantity: 1,
        price: product.price,
        total: product.price * 1,
      };
      const newSelectedProducts = [...selectedProducts, newProduct];
      setSelectedProducts(newSelectedProducts);
      calculateTotal(newSelectedProducts);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const qty = parseInt(quantity) || 0;
    const newSelectedProducts = selectedProducts.map((item) => {
      if (item.product._id === productId) {
        return {
          ...item,
          quantity: qty,
          total: item.price * qty,
        };
      }
      return item;
    });
    setSelectedProducts(newSelectedProducts);
    calculateTotal(newSelectedProducts);
  };

  const handlePriceChange = (productId, price) => {
    const priceValue = parseFloat(price) || 0;
    const newSelectedProducts = selectedProducts.map((item) => {
      if (item.product._id === productId) {
        return {
          ...item,
          price: priceValue,
          total: priceValue * item.quantity,
        };
      }
      return item;
    });
    setSelectedProducts(newSelectedProducts);
    calculateTotal(newSelectedProducts);
  };

  const handleRemoveProduct = (productId) => {
    const newSelectedProducts = selectedProducts.filter(
      (item) => item.product._id !== productId
    );
    setSelectedProducts(newSelectedProducts);
    calculateTotal(newSelectedProducts);
  };

  const calculateTotal = (productsList) => {
    const subtotal = productsList.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const total = parseFloat(subtotal.toFixed(2));
    setFormData((prev) => ({
      ...prev,
      total,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // if (!formData.supplier) {
    //   newErrors.supplier = "Supplier is required";
    // }
    if (selectedProducts.length === 0) {
      newErrors.products = "At least one product is required";
    }
    if (!formData.total || parseFloat(formData.total) <= 0) {
      newErrors.total = "Valid total is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const stockData = {
        ...formData,
        products: selectedProducts.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        total: parseFloat(formData.total),
        phone: formData.phone ? parseFloat(formData.phone) : undefined,
      };

      createStock(stockData, {
        onSuccess: () => {
          navigate("/stock");
        },
      });
    }
  };

  if (isLoadingProducts || isLoadingSuppliers) return <Loader />;

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shrink-0">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/stock")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Add Stock Entry
            </h1>
            <p className="text-sm text-muted-foreground">
              Record a new stock purchase from a supplier
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mx-auto max-w-5xl space-y-8 p-6">
          {/* Supplier Section */}
          <div className="w-full">
            <h2 className="mb-4 text-lg font-semibold text-neutral-700">
              Supplier Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supplier">
                  Supplier <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.supplier}
                  onValueChange={handleSupplierChange}
                >
                  <SelectTrigger id="supplier" className="w-full">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.supplier && (
                  <p className="text-xs text-destructive">{errors.supplier}</p>
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
                  placeholder="supplier@example.com"
                />
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
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-neutral-700">
              Products
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productSelect">
                  Select Products <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={handleProductSelect}>
                  <SelectTrigger id="productSelect" className="w-full">
                    <SelectValue placeholder="Select products to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name}{" "}
                        {product?.brand ? `- ${product.brand}` : ""} (₹
                        {product.price?.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.products && (
                  <p className="text-xs text-destructive">{errors.products}</p>
                )}
              </div>

              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Selected Products:
                  </Label>
                  <div className="space-y-3">
                    {selectedProducts.map((item) => (
                      <div
                        key={item.product._id}
                        className="rounded-lg border border-border bg-muted/50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-base mb-3">
                              {item.product.name}
                            </p>

                            <div className="grid grid-cols-3 gap-3">
                              {/* Quantity */}
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`quantity-${item.product._id}`}
                                  className="text-xs"
                                >
                                  Quantity
                                </Label>
                                <Input
                                  id={`quantity-${item.product._id}`}
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.product._id,
                                      e.target.value
                                    )
                                  }
                                  className="h-9"
                                />
                              </div>

                              {/* Price */}
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`price-${item.product._id}`}
                                  className="text-xs"
                                >
                                  Price (₹)
                                </Label>
                                <Input
                                  id={`price-${item.product._id}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.price}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      item.product._id,
                                      e.target.value
                                    )
                                  }
                                  className="h-9"
                                />
                              </div>

                              {/* Total */}
                              <div className="space-y-1">
                                <Label className="text-xs">Total</Label>
                                <div className="flex h-9 items-center rounded-md border border-input bg-background ">
                                  <span className="font-semibold text-sm">
                                    ₹{item.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveProduct(item.product._id)
                            }
                            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Remove product"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stock Settings */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-neutral-700">
              Stock Settings
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    handleSelectChange("paymentMethod", value)
                  }
                >
                  <SelectTrigger id="paymentMethod" className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Order Status */}
              <div className="space-y-2">
                <Label htmlFor="orderStatus">Status</Label>
                <Select
                  value={formData.orderStatus}
                  onValueChange={(value) =>
                    handleSelectChange("orderStatus", value)
                  }
                >
                  <SelectTrigger id="orderStatus" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status */}
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) =>
                    handleSelectChange("paymentStatus", value)
                  }
                >
                  <SelectTrigger id="paymentStatus" className="w-full">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partially_paid">
                      Partially Paid
                    </SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-neutral-700">
              Additional Information
            </h2>
            <div className="space-y-2">
              <Label htmlFor="description">Description / Notes</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter stock description or notes"
              />
            </div>
          </div>

          {/* Total */}
          <div className="md:col-span-2 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Total Amount:</Label>
              <span className="text-3xl font-bold text-primary">
                ₹{formData.total.toFixed(2)}
              </span>
            </div>
            {errors.total && (
              <p className="mt-1 text-xs text-destructive">{errors.total}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 flex justify-center gap-3 border-t border-border bg-card p-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/stock")}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating} size="lg">
            {isCreating ? "Creating Stock..." : "Create Stock"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateStock;


