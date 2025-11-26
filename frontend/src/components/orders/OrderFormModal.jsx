import React, { useState, useEffect } from "react";
import { useCreateOrder, useUpdateOrder } from "@/react-queries/orderQueries";
import { useGetProducts } from "@/react-queries/productQueries";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

const OrderFormModal = ({
  children,
  order,
  onSuccess,
  open: externalOpen,
  onOpenChange,
}) => {
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();
  const { data: productsData } = useGetProducts();
  const products = productsData?.data || [];

  const [internalOpen, setInternalOpen] = useState(false);

  // Use external open state if provided (for edit mode), otherwise use internal state (for create mode)
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    user: "",
    products: [],
    total: 0,
    description: "",
    shippingAddress: {
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    phone: "",
    email: "",
    hasInvoice: false,
    paymentMethod: "cash",
    orderStatus: "pending",
    paymentStatus: "pending",
    hasGST: false,
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (order) {
      setFormData({
        user: order.user?._id || order.user || "",
        products: order.products || [],
        total: order.total || 0,
        description: order.description || "",
        shippingAddress: order.shippingAddress || {
          streetAddress: "",
          streetAddress2: "",
          city: "",
          state: "",
          postalCode: "",
        },
        phone: order.phone || "",
        email: order.email || "",
        hasInvoice: order.hasInvoice || false,
        paymentMethod: order.paymentMethod || "cash",
        orderStatus: order.orderStatus || "pending",
        paymentStatus: order.paymentStatus || "pending",
        hasGST: order.hasGST || false,
      });
      // Transform order products to the format we need
      const transformedProducts = (order.products || []).map(item => ({
        product: {
          _id: item.product?._id || item.product,
          name: item.product?.name || "Unknown Product",
        },
        quantity: item.quantity || 1,
        price: item.price || 0,
        total: item.total || 0,
      }));
      setSelectedProducts(transformedProducts);
    } else {
      setFormData({
        user: "",
        products: [],
        total: 0,
        description: "",
        shippingAddress: {
          streetAddress: "",
          streetAddress2: "",
          city: "",
          state: "",
          postalCode: "",
        },
        phone: "",
        email: "",
        hasInvoice: false,
        paymentMethod: "cash",
        orderStatus: "pending",
        paymentStatus: "pending",
        hasGST: false,
      });
      setSelectedProducts([]);
    }
    setErrors({});
  }, [order, isOpen]);

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
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value,
      },
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
      calculateTotal(newSelectedProducts, formData.hasGST);
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
    calculateTotal(newSelectedProducts, formData.hasGST);
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
    calculateTotal(newSelectedProducts, formData.hasGST);
  };

  const handleRemoveProduct = (productId) => {
    const newSelectedProducts = selectedProducts.filter(
      (item) => item.product._id !== productId
    );
    setSelectedProducts(newSelectedProducts);
    calculateTotal(newSelectedProducts, formData.hasGST);
  };

  const calculateTotal = (productsList, includeGST) => {
    const subtotal = productsList.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = includeGST ? subtotal * 1.18 : subtotal; // 18% GST
    setFormData((prev) => ({
      ...prev,
      total: parseFloat(total.toFixed(2)),
    }));
  };

  const handleGSTChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      hasGST: checked,
    }));
    calculateTotal(selectedProducts, checked);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user.trim()) {
      newErrors.user = "User ID is required";
    }
    if (formData.products.length === 0) {
      newErrors.products = "At least one product is required";
    }
    if (!formData.total || parseFloat(formData.total) <= 0) {
      newErrors.total = "Valid total is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const orderData = {
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

      if (order) {
        updateOrder(
          { id: order._id, ...orderData },
          {
            onSuccess: () => {
              setIsOpen(false);
              if (onSuccess) onSuccess();
            },
          }
        );
      } else {
        createOrder(orderData, {
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
            {order ? "Edit Order" : "Create New Order"}
          </DialogTitle>
          <DialogDescription>
            {order
              ? "Update order information"
              : "Fill in the details to create a new order"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User ID */}
            <div className="space-y-2">
              <Label htmlFor="user">
                User ID <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                id="user"
                name="user"
                value={formData.user}
                onChange={handleChange}
                aria-invalid={!!errors.user}
                placeholder="Enter user ID"
              />
              {errors.user && (
                <p className="text-xs text-destructive">{errors.user}</p>
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
                placeholder="customer@example.com"
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
                placeholder="Enter phone number"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  handleChange({ target: { name: "paymentMethod", value } })
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
              <Label htmlFor="orderStatus">Order Status</Label>
              <Select
                name="orderStatus"
                value={formData.orderStatus}
                onValueChange={(value) =>
                  handleChange({ target: { name: "orderStatus", value } })
                }
              >
                <SelectTrigger id="orderStatus" className="w-full">
                  <SelectValue placeholder="Select order status" />
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
                name="paymentStatus"
                value={formData.paymentStatus}
                onValueChange={(value) =>
                  handleChange({ target: { name: "paymentStatus", value } })
                }
              >
                <SelectTrigger id="paymentStatus" className="w-full">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
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
                    {product.name} - ${product.price?.toFixed(2)}
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
                <Label className="text-sm font-semibold">Selected Products:</Label>
                <div className="space-y-2">
                  {selectedProducts.map((item) => (
                    <div
                      key={item.product._id}
                      className="rounded-lg border border-border bg-muted/50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-medium">{item.product.name}</p>
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
                          <Label htmlFor={`modal-qty-${item.product._id}`} className="text-xs">
                            Qty
                          </Label>
                          <Input
                            id={`modal-qty-${item.product._id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.product._id, e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <Label htmlFor={`modal-price-${item.product._id}`} className="text-xs">
                            Price
                          </Label>
                          <Input
                            id={`modal-price-${item.product._id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              handlePriceChange(item.product._id, e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </div>

                        {/* Total */}
                        <div className="space-y-1">
                          <Label className="text-xs">Total</Label>
                          <div className="flex h-8 items-center rounded-md border border-input bg-background px-2">
                            <span className="font-semibold text-xs">
                              ${item.total.toFixed(2)}
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

          {/* Switches */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <Label htmlFor="hasGST" className="cursor-pointer">
                Include GST (18%)
              </Label>
              <Switch
                id="hasGST"
                checked={formData.hasGST}
                onCheckedChange={handleGSTChange}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <Label htmlFor="hasInvoice" className="cursor-pointer">
                Has Invoice
              </Label>
              <Switch
                id="hasInvoice"
                checked={formData.hasInvoice}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, hasInvoice: checked }))
                }
              />
            </div>
          </div>

          {/* Total */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Total Amount:</Label>
              <span className="text-2xl font-bold text-foreground">
                ${formData.total.toFixed(2)}
              </span>
            </div>
            {formData.hasGST && (
              <p className="mt-1 text-xs text-muted-foreground">
                (Including 18% GST)
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter order description or notes"
            />
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Shipping Address</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.shippingAddress.streetAddress}
                  onChange={handleAddressChange}
                  placeholder="Enter street address"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="streetAddress2">Street Address 2</Label>
                <Input
                  type="text"
                  id="streetAddress2"
                  name="streetAddress2"
                  value={formData.shippingAddress.streetAddress2}
                  onChange={handleAddressChange}
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.shippingAddress.city}
                  onChange={handleAddressChange}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.shippingAddress.state}
                  onChange={handleAddressChange}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.shippingAddress.postalCode}
                  onChange={handleAddressChange}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
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
                : order
                ? "Update Order"
                : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormModal;

