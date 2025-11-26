import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./screens/private/dashboard";
import Layout from "./layouts/PrivateLayout";
import Products from "./screens/private/Products";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Orders from "./screens/private/Orders";
import CreateOrder from "./screens/private/CreateOrder";
import EditOrder from "./screens/private/EditOrder";
import ViewOrder from "./screens/private/ViewOrder";
import Users from "./screens/private/Users";
import Management from "./screens/private/Management";
import Settings from "./screens/private/Settings";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import { AuthProvider } from "./context/authContext";
import Home from "./screens/public/home";

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
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
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
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
