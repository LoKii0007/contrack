import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  UsersRoundIcon,
  Settings,
  LogOut,
  Store,
  UserStarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Products",
    icon: Package,
    path: "/products",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    path: "/orders",
  },
  {
    name: "Users",
    icon: UsersRoundIcon,
    path: "/users",
  },
  {
    name: "Management",
    icon: UserStarIcon,
    path: "/management",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            ConTrack
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-gray-100 hover:text-sidebar-accent-foreground font-normal hover:ease-in ease-out"
              }`}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  active
                    ? "font-medium"
                    : "font-normal"
                )}
              />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User/Logout Section */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={() => navigate("/logout")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
