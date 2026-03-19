import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Tracking from "./pages/Tracking";
import Authentication from "./pages/Authentication";
import DashboardLayout from "./components/DashboardLayout";

import DistributorLayout from "./components/DistributorLayout";
import DistributorDashboard from "./pages/DistributorDashboard";
import DistributorOrders from "./pages/DistributorOrders";
import DistributorTracking from "./pages/DistributorTracking";

import Login from "./pages/Login";

const queryClient = new QueryClient();

/* =========================
   LAYOUT WRAPPERS
========================= */

const DashboardPage = () => (
  <DashboardLayout>
    <Dashboard />
  </DashboardLayout>
);

const InventoryPage = () => (
  <DashboardLayout>
    <Inventory />
  </DashboardLayout>
);

const TrackingPage = () => (
  <DashboardLayout>
    <Tracking />
  </DashboardLayout>
);

const AuthenticationPage = () => (
  <DashboardLayout>
    <Authentication />
  </DashboardLayout>
);

const DistributorHomePage = () => (
  <DistributorLayout>
    <DistributorDashboard />
  </DistributorLayout>
);

const DistributorOrdersPage = () => (
  <DistributorLayout>
    <DistributorOrders />
  </DistributorLayout>
);

const DistributorTrackingPage = () => (
  <DistributorLayout>
    <DistributorTracking />
  </DistributorLayout>
);

/* =========================
   AUTH CHECK
========================= */

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* =========================
   ROLE CHECK (NEW)
========================= */

const RoleRoute = ({
  children,
  role,
}: {
  children: ReactNode;
  role: "pharmacist" | "distributor";
}) => {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* =========================
   APP
========================= */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="medsecure-theme"
      themes={["light", "dark"]}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* PHARMACIST ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute role="pharmacist">
                    <DashboardPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/inventory"
              element={
                <ProtectedRoute>
                  <RoleRoute role="pharmacist">
                    <InventoryPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tracking"
              element={
                <ProtectedRoute>
                  <RoleRoute role="pharmacist">
                    <TrackingPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/authentication"
              element={
                <ProtectedRoute>
                  <RoleRoute role="pharmacist">
                    <AuthenticationPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* DISTRIBUTOR ROUTES */}
            <Route
              path="/distributor"
              element={
                <ProtectedRoute>
                  <RoleRoute role="distributor">
                    <DistributorHomePage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/distributor/orders"
              element={
                <ProtectedRoute>
                  <RoleRoute role="distributor">
                    <DistributorOrdersPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/distributor/tracking"
              element={
                <ProtectedRoute>
                  <RoleRoute role="distributor">
                    <DistributorTrackingPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;