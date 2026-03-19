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
import { isAuthenticated } from "./lib/auth";

const queryClient = new QueryClient();

const DashboardPage = () => <DashboardLayout><Dashboard /></DashboardLayout>;
const InventoryPage = () => <DashboardLayout><Inventory /></DashboardLayout>;
const TrackingPage = () => <DashboardLayout><Tracking /></DashboardLayout>;
const AuthenticationPage = () => <DashboardLayout><Authentication /></DashboardLayout>;

const DistributorHomePage = () => <DistributorLayout><DistributorDashboard /></DistributorLayout>;
const DistributorOrdersPage = () => <DistributorLayout><DistributorOrders /></DistributorLayout>;
const DistributorTrackingPage = () => <DistributorLayout><DistributorTracking /></DistributorLayout>;

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

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
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
            <Route path="/dashboard/tracking" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />
            <Route path="/dashboard/authentication" element={<ProtectedRoute><AuthenticationPage /></ProtectedRoute>} />
            <Route path="/distributor" element={<ProtectedRoute><DistributorHomePage /></ProtectedRoute>} />
            <Route path="/distributor/orders" element={<ProtectedRoute><DistributorOrdersPage /></ProtectedRoute>} />
            <Route path="/distributor/tracking" element={<ProtectedRoute><DistributorTrackingPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
