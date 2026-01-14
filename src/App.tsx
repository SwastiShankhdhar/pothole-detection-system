import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SelectAccount from "./pages/SelectAccount";
import CitizenAuth from "./pages/CitizenAuth";
import AuthorityAuth from "./pages/AuthorityAuth";
import CitizenDashboard from "./pages/CitizenDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select-account" element={<SelectAccount />} />
          <Route path="/citizen/auth" element={<CitizenAuth />} />
          <Route path="/authority/auth" element={<AuthorityAuth />} />
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
          <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
