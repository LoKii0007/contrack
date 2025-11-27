import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "@/components/react-queries/orderQueries";
import { useGetProducts } from "@/components/react-queries/productQueries";
import { useGetCustomers } from "@/components/react-queries/userQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, ArrowLeft, UserPlus, Plus } from "lucide-react";
import Loader from "@/components/Loader";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();
  const { data: usersData, isLoading: isLoadingUsers } = useGetCustomers({
    limit: 1000,
  });
  const products = productsData?.data || [];
  const users = usersData?.data || [];

  const [formData, setFormData] = useState({
    customer: "",
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
    isNewUser: false,
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);
  const [openUserCombobox, setOpenUserCombobox] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

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
    const subtotal = productsList.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const total = includeGST ? subtotal * 1.18 : subtotal; // 18% GST
    const newTotal = parseFloat(total.toFixed(2));

    setFormData((prev) => ({
      ...prev,
      total: newTotal,
    }));

    // Update payment history remaining amounts when total changes
    if (paymentHistory.length > 0) {
      let cumulativePaid = 0;
      setPaymentHistory((prev) => {
        return prev.map((payment) => {
          cumulativePaid += parseFloat(payment.creditAmount) || 0;
          return {
            ...payment,
            remainingAmount: Math.max(0, newTotal - cumulativePaid),
          };
        });
      });
    }
  };

  const handleGSTChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      hasGST: checked,
    }));
    calculateTotal(selectedProducts, checked);
  };

  const handleAddPayment = () => {
    const totalPaid = paymentHistory.reduce(
      (sum, payment) => sum + (payment.creditAmount || 0),
      0
    );
    const remainingAmount = Math.max(0, formData.total - totalPaid);

    setPaymentHistory((prev) => [
      ...prev,
      {
        paymentDate: new Date().toISOString(),
        creditAmount: 0,
        paymentMethod: "cash",
        remainingAmount: remainingAmount,
        receiver: "",
      },
    ]);
  };

  const handleRemovePayment = (index) => {
    setPaymentHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (index, field, value) => {
    setPaymentHistory((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      // Recalculate remaining amounts for all payments sequentially
      let cumulativePaid = 0;
      updated.forEach((payment, i) => {
        cumulativePaid += parseFloat(payment.creditAmount) || 0;
        updated[i].remainingAmount = Math.max(
          0,
          formData.total - cumulativePaid
        );
      });

      return updated;
    });
  };

  const handleCustomerSelect = (customerId) => {
    if (customerId) {
      setFormData((prev) => ({
        ...prev,
        customer: customerId,
        isNewUser: false,
      }));
      setIsAddingNewUser(false);
      if (errors.customer) {
        setErrors((prev) => ({
          ...prev,
          customer: "",
        }));
      }
    }
  };

  const handleAddNewUserClick = () => {
    setIsAddingNewUser(true);
    setFormData((prev) => ({
      ...prev,
      customer: "",
      isNewUser: true,
    }));
    setOpenUserCombobox(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer.trim()) {
      newErrors.customer = isAddingNewUser 
        ? "Customer name is required" 
        : "Please select a customer";
    }
    if (selectedProducts.length === 0) {
      newErrors.products = "At least one product is required";
    }
    if (!formData.total || parseFloat(formData.total) <= 0) {
      newErrors.total = "Valid total is required";
    }
    // if (!formData.email.trim()) {
    //   newErrors.email = "Email is required";
    // }

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
        isNewUser: isAddingNewUser,
      };

      // Map customer to user for API compatibility
      orderData.user = formData.customer;

      // Add payment history if any payments were added
      if (paymentHistory.length > 0) {
        orderData.paymentHistory = paymentHistory
          .filter((payment) => payment.creditAmount > 0)
          .map((payment) => ({
            paymentDate: payment.paymentDate,
            creditAmount: parseFloat(payment.creditAmount),
            paymentMethod: payment.paymentMethod,
            remainingAmount: parseFloat(payment.remainingAmount),
            receiver: payment.receiver || undefined,
          }));
      }

      createOrder(orderData, {
        onSuccess: () => {
          navigate("/orders");
        },
      });
    }
  };

  // if (isLoadingProducts || isLoadingUsers) return <Loader />;

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shrink-0">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/orders")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create New Order
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details to create a new order
            </p>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="">
        <form onSubmit={handleSubmit} className=" space-y-8">
          <div className="mx-auto max-w-5xl space-y-8 p-6">
            {/* Customer Information Section */}
            <div className="w-full">
              <h2 className="mb-4 text-lg font-semibold text-neutral-700">
                Customer Information
              </h2>
              <div className="grid gap-6 md:grid-cols-2 ">
                {/* User Selection */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="customer">
                    Customer <span className="text-destructive">*</span>
                  </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddNewUserClick}
                      className="h-8"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New User
                    </Button>
                  </div>

                  {isAddingNewUser ? (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        id="customer"
                        name="customer"
                        value={formData.customer}
                        onChange={handleChange}
                        aria-invalid={!!errors.customer}
                        placeholder="Enter customer name"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Creating new customer with this name
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsAddingNewUser(false);
                            setFormData((prev) => ({
                              ...prev,
                              customer: "",
                              isNewUser: false,
                            }));
                          }}
                          className="h-7 text-xs"
                        >
                          Select Existing
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Popover
                      open={openUserCombobox}
                      onOpenChange={setOpenUserCombobox}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openUserCombobox}
                          className="w-full justify-between"
                        >
                          {formData.customer
                            ? users.find((user) => user._id === formData.customer)
                                ?.name
                            : "Select customer..."}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search customers..." />
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user._id}
                                  value={user.name}
                                  onSelect={() => {
                                    handleCustomerSelect(user._id);
                                    setOpenUserCombobox(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.customer === user._id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>{user.name}</span>
                                    {user.email && (
                                      <span className="text-xs text-muted-foreground">
                                        {user.email}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  {errors.customer && (
                    <p className="text-xs text-destructive">{errors.customer}</p>
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
              </div>
            </div>

            <Separator className="my-4" />

            {/* Products Section */}
            <div className="">
              <h2 className="mb-4 text-lg font-semibold text-neutral-700">
                Products
              </h2>
              <div className="space-y-4 ">
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
                    <p className="text-xs text-destructive">
                      {errors.products}
                    </p>
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

                    {/* Subtotal */}
                    <div className="rounded-lg border border-border bg-background p-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Products Subtotal:</span>
                        <span className="font-semibold">
                          ₹
                          {selectedProducts
                            .reduce((sum, item) => sum + item.total, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Order Settings Section */}
            <div className="">
              <h2 className="mb-4 text-lg font-semibold text-neutral-700">
                Order Settings
              </h2>
              <div className="grid gap-6 md:grid-cols-2 ">
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
                      <SelectItem value="partially_paid">
                        Partially Paid
                      </SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Switches */}
                <div className="space-y-4 md:col-span-2">
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
                        setFormData((prev) => ({
                          ...prev,
                          hasInvoice: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />
            {/* Description Section */}
            <div className="">
              <h2 className="mb-4 text-lg font-semibold text-neutral-700">
                Additional Information
              </h2>
              <div className="space-y-2 ">
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter order description or notes"
                />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Shipping Address Section */}
            <div className="">
              <h2 className="mb-4 text-lg font-semibold text-neutral-700">
                Shipping Address
              </h2>
              <div className="grid gap-4 md:grid-cols-2 ">
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

            <Separator className="my-4" />

            {/* Payment History Section */}
            <div className="">
              <div className="mb-4 flex items-center justify-between ">
                <h2 className="text-lg font-semibold text-neutral-700">
                  Payment History
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPayment}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Optionally add payment history while creating the order
              </p>

              {paymentHistory.length > 0 && (
                <div className="space-y-4 ">
                  {paymentHistory.map((payment, index) => {
                    const totalPaidBefore = paymentHistory
                      .slice(0, index)
                      .reduce(
                        (sum, p) => sum + (parseFloat(p.creditAmount) || 0),
                        0
                      );
                    const maxPayment = formData.total - totalPaidBefore;

                    return (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-muted/50 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-sm font-semibold">
                            Payment #{index + 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleRemovePayment(index)}
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Remove payment"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Payment Date */}
                          <div className="space-y-2">
                            <Label htmlFor={`paymentDate-${index}`}>
                              Payment Date{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              type="datetime-local"
                              id={`paymentDate-${index}`}
                              value={
                                payment.paymentDate
                                  ? new Date(payment.paymentDate)
                                      .toISOString()
                                      .slice(0, 16)
                                  : ""
                              }
                              onChange={(e) => {
                                const dateValue = e.target.value
                                  ? new Date(e.target.value).toISOString()
                                  : new Date().toISOString();
                                handlePaymentChange(
                                  index,
                                  "paymentDate",
                                  dateValue
                                );
                              }}
                              className="h-9"
                            />
                          </div>

                          {/* Credit Amount */}
                          <div className="space-y-2">
                            <Label htmlFor={`creditAmount-${index}`}>
                              Payment Amount{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              type="number"
                              id={`creditAmount-${index}`}
                              step="0.01"
                              min="0"
                              max={maxPayment}
                              value={payment.creditAmount || ""}
                              onChange={(e) => {
                                const amount = parseFloat(e.target.value) || 0;
                                handlePaymentChange(
                                  index,
                                  "creditAmount",
                                  amount
                                );
                              }}
                              className="h-9"
                              placeholder="0.00"
                            />
                            {maxPayment < formData.total && (
                              <p className="text-xs text-muted-foreground">
                                Max: ${maxPayment.toFixed(2)}
                              </p>
                            )}
                          </div>

                          {/* Payment Method */}
                          <div className="space-y-2">
                            <Label htmlFor={`paymentMethod-${index}`}>
                              Payment Method
                            </Label>
                            <Select
                              value={payment.paymentMethod}
                              onValueChange={(value) =>
                                handlePaymentChange(
                                  index,
                                  "paymentMethod",
                                  value
                                )
                              }
                            >
                              <SelectTrigger
                                id={`paymentMethod-${index}`}
                                className="h-9"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Receiver */}
                          <div className="space-y-2">
                            <Label htmlFor={`receiver-${index}`}>
                              Receiver (Optional)
                            </Label>
                            <Input
                              type="text"
                              id={`receiver-${index}`}
                              value={payment.receiver || ""}
                              onChange={(e) =>
                                handlePaymentChange(
                                  index,
                                  "receiver",
                                  e.target.value
                                )
                              }
                              className="h-9"
                              placeholder="Enter receiver name"
                            />
                          </div>
                        </div>

                        {/* Remaining Amount Display */}
                        <div className="mt-4 rounded-lg border border-border bg-background p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Remaining Amount:
                            </span>
                            <span className="font-semibold">
                              ₹{payment.remainingAmount?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <Separator className="my-4" />
                  {/* Payment Summary */}
                  <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 ">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Order Total:
                        </span>
                        <span className="font-medium">
                          ₹{formData.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Paid:
                        </span>
                        <span className="font-medium text-green-600">
                          ₹
                          {paymentHistory
                            .reduce(
                              (sum, payment) =>
                                sum + (parseFloat(payment.creditAmount) || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
                        <span>Remaining:</span>
                        <span className="text-yellow-600">
                          ₹
                          {(
                            formData.total -
                            paymentHistory.reduce(
                              (sum, payment) =>
                                sum + (parseFloat(payment.creditAmount) || 0),
                              0
                            )
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentHistory.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No payments added. Click "Add Payment" to record a payment.
                </p>
              )}
            </div>

            <Separator className="my-4" />

            {/* Total Display */}
            <div className="md:col-span-2 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Total Amount:</Label>
                <span className="text-3xl font-bold text-primary">
                  ₹{formData.total.toFixed(2)}
                </span>
              </div>
              {formData.hasGST && (
                <p className="mt-1 text-xs text-muted-foreground">
                  (Including 18% GST)
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 flex justify-center gap-3 border-t border-border bg-card p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/orders")}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} size="lg">
              {isCreating ? "Creating Order..." : "Create Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
