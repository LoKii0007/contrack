import React, { useEffect, useState } from "react";
import { useCreateStock, useUpdateStock } from "@/components/react-queries/stockQueries";
import { useGetProducts } from "@/components/react-queries/productQueries";
import { useGetSuppliers } from "@/components/react-queries/supplierQueries";
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
import { X } from "lucide-react";

const StockFormModal = ({ children, stock, onSuccess, open: externalOpen, onOpenChange }) => {
  const { mutate: createStock, isPending: isCreating } = useCreateStock();
  const { mutate: updateStock, isPending: isUpdating } = useUpdateStock();
  const { data: productsData } = useGetProducts();
  const { data: suppliersData } = useGetSuppliers({ limit: 100 });

  const products = productsData?.data || [];
  const suppliers = suppliersData?.data || [];

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    supplier: "",
    products: [],
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
        products: stock.products || [],
        total: stock.total || 0,
        description: stock.description || "",
        phone: stock.phone || "",
        email: stock.email || "",
        paymentMethod: stock.paymentMethod || "cash",
        orderStatus: stock.orderStatus || "pending",
        paymentStatus: stock.paymentStatus || "pending",
      });
      setSelectedProducts(transformedProducts);
    } else {
      setFormData({
        supplier: "",
        products: [],
        total: 0,
        description: "",
        phone: "",
        email: "",
        paymentMethod: "cash",
        orderStatus: "pending",
        paymentStatus: "pending",
      });
      setSelectedProducts([]);
    }
    setErrors({});
  }, [stock, isOpen]);

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

  const handleStatusSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product && !selectedProducts.find((item) => item.product._id === productId)) {
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

      if (stock) {
        updateStock(
          { id: stock._id, ...stockData },
          {
            onSuccess: () => {
              setIsOpen(false);
              if (onSuccess) onSuccess();
            },
          }
        );
      } else {
        createStock(stockData, {
          onSuccess: () => {
            setIsOpen(false);
            if (onSuccess) onSuccess();
          },
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {stock ? "Edit Stock Entry" : "Add Stock Entry"}
          </DialogTitle>
          <DialogDescription>
            {stock
              ? "Update stock information"
              : "Fill in the details to add a new stock entry"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Supplier */}
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

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  handleStatusSelect("paymentMethod", value)
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
                  handleStatusSelect("orderStatus", value)
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
                  handleStatusSelect("paymentStatus", value)
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

          {/* Products Selection */}
          <div className="space-y-2">
            <Label htmlFor="productSelect">
              Products <span className="text-destructive">*</span>
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

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label className="text-sm font-semibold">
                  Selected Products:
                </Label>
                <div className="space-y-2">
                  {selectedProducts.map((item) => (
                    <div
                      key={item.product._id}
                      className="rounded-lg border border-border bg-muted/50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-medium">
                          {item.product.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item.product._id)}
                          className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Quantity */}
                        <div className="space-y-1">
                          <Label
                            htmlFor={`qty-${item.product._id}`}
                            className="text-xs"
                          >
                            Qty
                          </Label>
                          <Input
                            id={`qty-${item.product._id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product._id,
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <Label
                            htmlFor={`price-${item.product._id}`}
                            className="text-xs"
                          >
                            Price
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
                            className="h-8 text-sm"
                          />
                        </div>

                        {/* Total */}
                        <div className="space-y-1">
                          <Label className="text-xs">Total</Label>
                          <div className="flex h-8 items-center rounded-md border border-input bg-background px-2">
                            <span className="font-semibold text-xs">
                              ₹{item.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Total Amount:</Label>
              <span className="text-2xl font-bold text-foreground">
                ₹{formData.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description / Notes</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description or notes"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
                : stock
                ? "Update Stock"
                : "Add Stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockFormModal;


