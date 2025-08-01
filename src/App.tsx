
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./components/auth/LoginPage";
import SuperAdminSetup from "./components/auth/SuperAdminSetup";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "MyKTM";
    if (path === "/auth") {
      title = "Login | MyKTM";
    } else if (path === "/") {
      title = "Dashboard | MyKTM";
    }
    document.title = title;
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PageTitle />
          <Routes>
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/setup-superadmin" element={<SuperAdminSetup />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
