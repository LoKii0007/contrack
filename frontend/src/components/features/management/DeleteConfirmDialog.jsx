import React from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, tenantAdminName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card shadow-lg mx-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Delete Tenant Admin
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-sm text-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{tenantAdminName}</span>? This will
            permanently remove the tenant admin from your system.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-border p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            Delete Tenant Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;

