import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Package, MapPin, CreditCard, FileText } from "lucide-react";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "partially_paid":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "failed":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatPaymentStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const totalPaid = order.paymentHistory?.reduce(
    (sum, payment) => sum + (payment.creditAmount || 0),
    0
  ) || 0;

  const remainingAmount = (order.total || 0) - totalPaid;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Complete information about this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm font-medium">{order._id}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                {formatPaymentStatus(order.paymentStatus)}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-lg border border-border p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{order.user?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">
                  {order.email || order.user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{order.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {order.createdAt
                    ? format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products ({order.products?.length || 0})
            </h3>
            <div className="space-y-2">
              {order.products?.map((item, index) => (
                <div
                  key={item._id || index}
                  className="rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {item.product?.name || "Unknown Product"}
                      </p>
                      {item.product?.description && (
                        <p className="text-xs text-muted-foreground">
                          {item.product.description}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-sm ml-2">
                      ${item.total?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Qty: <span className="font-medium text-foreground">{item.quantity || 1}</span></span>
                    <span>×</span>
                    <span>Price: <span className="font-medium text-foreground">${item.price?.toFixed(2) || "0.00"}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="rounded-lg border border-border p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </h3>
              <div className="text-sm space-y-1">
                {order.shippingAddress.streetAddress && (
                  <p>{order.shippingAddress.streetAddress}</p>
                )}
                {order.shippingAddress.streetAddress2 && (
                  <p>{order.shippingAddress.streetAddress2}</p>
                )}
                {(order.shippingAddress.city ||
                  order.shippingAddress.state ||
                  order.shippingAddress.postalCode) && (
                  <p>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                {!order.shippingAddress.streetAddress &&
                  !order.shippingAddress.city && (
                    <p className="text-muted-foreground">No address provided</p>
                  )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Has Invoice</p>
                <p className="font-medium">{order.hasInvoice ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">GST Included</p>
                <p className="font-medium">{order.hasGST ? "Yes (18%)" : "No"}</p>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-2 border-t border-border mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Total:</span>
                <span className="font-semibold">${order.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Paid:</span>
                <span className="font-semibold text-green-600">
                  ${totalPaid.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
                <span>Remaining:</span>
                <span className={remainingAmount > 0 ? "text-yellow-600" : "text-green-600"}>
                  ${remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {order.paymentHistory && order.paymentHistory.length > 0 && (
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h3 className="font-semibold">Payment History</h3>
              <div className="space-y-2">
                {order.paymentHistory.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        ${payment.creditAmount?.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.paymentDate
                          ? format(new Date(payment.paymentDate), "MMM dd, yyyy HH:mm")
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground capitalize">
                        {payment.paymentMethod}
                      </p>
                      {payment.receiver && (
                        <p className="text-xs text-muted-foreground">
                          By: {payment.receiver}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="font-medium">
                        ${payment.remainingAmount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {order.description && (
            <div className="rounded-lg border border-border p-4 space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{order.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;

