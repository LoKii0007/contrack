import React, { useState } from "react";
import { useAddPayment } from "@/components/react-queries/orderQueries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

const AddPaymentModal = ({ order, isOpen, onClose }) => {
  const { mutate: addPayment, isPending } = useAddPayment();

  const [formData, setFormData] = useState({
    creditAmount: "",
    paymentMethod: "cash",
    receiver: "",
  });

  const [errors, setErrors] = useState({});

  const calculateRemainingAmount = () => {
    const totalPaid = order?.paymentHistory?.reduce(
      (sum, payment) => sum + (payment.creditAmount || 0),
      0
    ) || 0;
    const newPayment = parseFloat(formData.creditAmount) || 0;
    return Math.max(0, (order?.total || 0) - totalPaid - newPayment);
  };

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

    if (!formData.creditAmount || parseFloat(formData.creditAmount) <= 0) {
      newErrors.creditAmount = "Valid payment amount is required";
    }

    const totalPaid = order?.paymentHistory?.reduce(
      (sum, payment) => sum + (payment.creditAmount || 0),
      0
    ) || 0;
    const newPayment = parseFloat(formData.creditAmount) || 0;
    
    if (totalPaid + newPayment > order?.total) {
      newErrors.creditAmount = "Payment exceeds remaining amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const paymentData = {
        paymentDate: new Date().toISOString(),
        creditAmount: parseFloat(formData.creditAmount),
        paymentMethod: formData.paymentMethod,
        remainingAmount: calculateRemainingAmount(),
        receiver: formData.receiver || undefined,
      };

      addPayment(
        { orderId: order._id, paymentData },
        {
          onSuccess: () => {
            setFormData({
              creditAmount: "",
              paymentMethod: "cash",
              receiver: "",
            });
            onClose();
          },
        }
      );
    }
  };

  const totalPaid = order?.paymentHistory?.reduce(
    (sum, payment) => sum + (payment.creditAmount || 0),
    0
  ) || 0;

  const remainingAmount = (order?.total || 0) - totalPaid;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for this order
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Total:</span>
              <span className="font-medium">${order?.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Paid:</span>
              <span className="font-medium text-green-600">
                ${totalPaid.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
              <span>Remaining:</span>
              <span className="text-yellow-600">
                ${remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="creditAmount">
              Payment Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              id="creditAmount"
              name="creditAmount"
              value={formData.creditAmount}
              onChange={handleChange}
              step="0.01"
              min="0"
              max={remainingAmount}
              aria-invalid={!!errors.creditAmount}
              placeholder="0.00"
            />
            {errors.creditAmount && (
              <p className="text-xs text-destructive">{errors.creditAmount}</p>
            )}
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

          {/* Receiver */}
          <div className="space-y-2">
            <Label htmlFor="receiver">Receiver (Optional)</Label>
            <Input
              type="text"
              id="receiver"
              name="receiver"
              value={formData.receiver}
              onChange={handleChange}
              placeholder="Enter receiver name"
            />
          </div>

          {/* Calculated Remaining */}
          {formData.creditAmount && parseFloat(formData.creditAmount) > 0 && (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Remaining after this payment:
                </span>
                <span className="font-semibold">
                  ${calculateRemainingAmount().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;

