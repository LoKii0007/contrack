import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateStock, useGetStockById } from "@/components/react-queries/stockQueries";
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

const EditStock = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: stockData, isLoading: isLoadingStock } = useGetStockById(id);
  const { mutate: updateStock, isPending: isUpdating } = useUpdateStock();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useGetSuppliers({ limit: 100 });

  const products = productsData?.data || [];
  const suppliers = suppliersData?.data || [];
  const stock = stockData?.data;

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

  useEffect(() => {
    if (stock) {
      const transformedProducts = (stock.products || []).map((item) => ({
        product: {
          _id: item.product?._id || item.product,
          name: item.product?.name || "Unknown Product",
        },
        quantity: item.quantity || 1,
        price: item.price || 0,
        total: item.total || 0,
      }));

      setFormData({
        supplier: stock.supplier?._id || stock.supplier || "",
        total: stock.total || 0,
        description: stock.description || "",
        phone: stock.phone || "",
        email: stock.email || "",
        paymentMethod: stock.paymentMethod || "cash",
        orderStatus: stock.orderStatus || "pending",
        paymentStatus: stock.paymentStatus || "pending",
      });
      setSelectedProducts(transformedProducts);
    }
  }, [stock]);

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

    if (!formData.supplier) {
      newErrors.supplier = "Supplier is required";
    }
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

      updateStock(
        { id, ...stockData },
        {
          onSuccess: () => {
            navigate("/stock");
          },
        }
      );
    }
  };

  if (isLoadingStock || isLoadingProducts || isLoadingSuppliers) return <Loader />;
  if (!stock) return <div>Stock entry not found</div>;

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card">
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
              Edit Stock Entry
            </h1>
            <p className="text-sm text-muted-foreground">
              Update stock information
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Supplier Section */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Supplier Information</h2>
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
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Products</h2>
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
                        {product.name} - ₹{product.price?.toFixed(2)}
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
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Stock Settings</h2>
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

            {/* Total */}
            <div className="mt-6 md:col-span-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
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

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Additional Information</h2>
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

          {/* Actions */}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-card p-6 shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/stock")}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} size="lg">
              {isUpdating ? "Updating Stock..." : "Update Stock"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditStock;


