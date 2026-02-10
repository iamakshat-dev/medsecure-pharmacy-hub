import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/inventory" element={<InventoryPage />} />
          <Route path="/dashboard/tracking" element={<TrackingPage />} />
          <Route path="/dashboard/authentication" element={<AuthenticationPage />} />
          <Route path="/distributor" element={<DistributorHomePage />} />
          <Route path="/distributor/orders" element={<DistributorOrdersPage />} />
          <Route path="/distributor/tracking" element={<DistributorTrackingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
