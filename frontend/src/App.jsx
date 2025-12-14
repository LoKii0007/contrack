import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./app/screens/private/dashboard/dashboard";
import Layout from "./layouts/PrivateLayout";
import Products from "./app/screens/private/products/Products";
import StockPage from "./app/screens/private/stock/StockPage";
import CreateStock from "./app/screens/private/stock/CreateStock";
import EditStock from "./app/screens/private/stock/EditStock";
import Suppliers from "./app/screens/private/suppliers/Suppliers";
import CreateSupplier from "./app/screens/private/suppliers/CreateSupplier";
import EditSupplier from "./app/screens/private/suppliers/EditSupplier";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Orders from "./app/screens/private/orders/Orders";
import CreateOrder from "./app/screens/private/orders/CreateOrder";
import EditOrder from "./app/screens/private/orders/EditOrder";
import ViewOrder from "./app/screens/private/orders/ViewOrder";
import Users from "./app/screens/private/users/Users";
import Management from "./app/screens/private/management/Management";
import Settings from "./app/screens/private/settings/Settings";
import Analytics from "./app/screens/private/analytics/Analytics";
import Login from "./app/screens/auth/Login";
import Register from "./app/screens/auth/Register";
import { AuthProvider } from "./app/context/authContext";
import Home from "./app/screens/public/home";

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />

            {/* auth routes */}
            <Route path="/">
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* private routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Analytics />} />
              <Route path="products" element={<Products />} />
              <Route path="stock" element={<StockPage />} />
              <Route path="stock/new" element={<CreateStock />} />
              <Route path="stock/:id/edit" element={<EditStock />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="suppliers/new" element={<CreateSupplier />} />
              <Route path="suppliers/:id/edit" element={<EditSupplier />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/new" element={<CreateOrder />} />
              <Route path="orders/:id/edit" element={<EditOrder />} />
              <Route path="orders/:id/view" element={<ViewOrder />} />
              <Route path="users" element={<Users />} />
              <Route path="management" element={<Management />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
