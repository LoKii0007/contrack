import React from "react";
import { Edit, Trash2, Package } from "lucide-react";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { label: "Out of Stock", color: "text-destructive" };
    if (stock < 20) return { label: "Low Stock", color: "text-yellow-600" };
    return { label: "In Stock", color: "text-green-600" };
  };

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No products found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by adding your first product
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm h-full flex flex-col overflow-hidden">
      {/* Table Wrapper: This handles the scrolling */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left">
          {/* Sticky Header */}
          <thead className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                Product
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                SKU
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                Price
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                Stock
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {product.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {product.stock}
                      </span>
                      <span className={`text-xs ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        title="Edit product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination - Fixed at the bottom (Outside the scrollable area) */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-card z-10 shrink-0">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{products.length}</span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{products.length}</span>{" "}
          products
        </div>
        <div className="flex gap-2">
          <button
            disabled
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;