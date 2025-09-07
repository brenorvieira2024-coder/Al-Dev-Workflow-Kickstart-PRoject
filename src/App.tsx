import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/hooks/useCart";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Customer Pages
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerHome from "./pages/customer/CustomerHome";
import StorePage from "./pages/customer/StorePage";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";

// Vendor Pages
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import ProductManagement from "./pages/vendor/ProductManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Customer Routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/home" element={<CustomerHome />} />
              <Route path="/customer/store/:storeId" element={<StorePage />} />
              <Route path="/customer/product/:productId" element={<ProductDetails />} />
              <Route path="/customer/cart" element={<Cart />} />
              <Route path="/customer/checkout" element={<Checkout />} />
              
              {/* Vendor Routes */}
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/products" element={<ProductManagement />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
