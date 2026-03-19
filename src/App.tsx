import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

const queryClient = new QueryClient();

const DashboardPage = () => <DashboardLayout><Dashboard /></DashboardLayout>;
const InventoryPage = () => <DashboardLayout><Inventory /></DashboardLayout>;
const TrackingPage = () => <DashboardLayout><Tracking /></DashboardLayout>;
const AuthenticationPage = () => <DashboardLayout><Authentication /></DashboardLayout>;

const DistributorHomePage = () => <DistributorLayout><DistributorDashboard /></DistributorLayout>;
const DistributorOrdersPage = () => <DistributorLayout><DistributorOrders /></DistributorLayout>;
const DistributorTrackingPage = () => <DistributorLayout><DistributorTracking /></DistributorLayout>;

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, token, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/" replace />;
};

const App = () => (
  <AuthProvider>
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
              <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
              <Route path="/dashboard/inventory" element={<RequireAuth><InventoryPage /></RequireAuth>} />
              <Route path="/dashboard/tracking" element={<RequireAuth><TrackingPage /></RequireAuth>} />
              <Route path="/dashboard/authentication" element={<RequireAuth><AuthenticationPage /></RequireAuth>} />
              <Route path="/distributor" element={<RequireAuth><DistributorHomePage /></RequireAuth>} />
              <Route path="/distributor/orders" element={<RequireAuth><DistributorOrdersPage /></RequireAuth>} />
              <Route path="/distributor/tracking" element={<RequireAuth><DistributorTrackingPage /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </AuthProvider>
); 

export default App;
