import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { PaymentLayout } from "./components/layout/PaymentLayout";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Orders from "./pages/Orders";
import Forum from "./pages/Forum";
import Lending from "./pages/Lending";
import Expenses from "./pages/Expenses";
import Insights from "./pages/Insights";
import Schemes from "./pages/Schemes";
import Banking from "./pages/Banking";
import Cart from "./pages/Cart";
import Pay from "./pages/Pay";
import Auth from "./pages/Auth";
import LocationMap from "./components/LocationMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - authentication required */}
            <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/equipment" element={<ProtectedRoute><Layout><Equipment /></Layout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute><Layout><Forum /></Layout></ProtectedRoute>} />
            <Route path="/lending" element={<ProtectedRoute><Layout><Lending /></Layout></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Layout><Expenses /></Layout></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Layout><Insights /></Layout></ProtectedRoute>} />
            <Route path="/schemes" element={<ProtectedRoute><Layout><Schemes /></Layout></ProtectedRoute>} />
            <Route path="/banking" element={<ProtectedRoute><Layout><Banking /></Layout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
            <Route path="/location" element={<ProtectedRoute><Layout><LocationMap /></Layout></ProtectedRoute>} />
            
            {/* Payment route without navbar - also protected */}
            <Route path="/pay" element={<ProtectedRoute><PaymentLayout><Pay /></PaymentLayout></ProtectedRoute>} />
            
            {/* Catch-all route - also protected */}
            <Route path="*" element={<ProtectedRoute><Layout><NotFound /></Layout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
