import React from "react";
import { Edit, Trash2, Users } from "lucide-react";

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No suppliers found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your first supplier to start tracking stock purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Addresses
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {suppliers.map((supplier) => (
              <tr
                key={supplier._id}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {supplier.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">
                    {supplier.email || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">
                    {supplier.phone || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {supplier.addresses && supplier.addresses.length > 0 ? (
                    <div className="text-sm text-foreground">
                      {supplier.addresses[0].streetAddress && (
                        <div>{supplier.addresses[0].streetAddress}</div>
                      )}
                      {supplier.addresses[0].city && (
                        <div className="text-xs text-muted-foreground">
                          {[supplier.addresses[0].city, supplier.addresses[0].state, supplier.addresses[0].postalCode]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No address
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(supplier)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      title="Edit supplier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(supplier)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      title="Delete supplier"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{suppliers.length}</span>{" "}
          suppliers
        </div>
      </div>
    </div>
  );
};

export default SupplierTable;


