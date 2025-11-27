import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./app/screens/private/dashboard";
import Layout from "./layouts/PrivateLayout";
import Products from "./app/screens/private/Products";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Orders from "./app/screens/private/Orders";
import CreateOrder from "./app/screens/private/CreateOrder";
import EditOrder from "./app/screens/private/EditOrder";
import ViewOrder from "./app/screens/private/ViewOrder";
import Users from "./app/screens/private/Users";
import Management from "./app/screens/private/Management";
import Settings from "./app/screens/private/Settings";
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
