import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import Splash from "./pages/Splash";
import Scanner from "./pages/Scanner";
import Generator from "./pages/Generator";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/app" element={<AppLayout />}>
              <Route path="scanner" element={<Scanner />} />
              <Route path="generator" element={<Generator />} />
              <Route path="history" element={<History />} />
            </Route>
            <Route path="/scanner" element={<AppLayout />}>
              <Route index element={<Scanner />} />
            </Route>
            <Route path="/generator" element={<AppLayout />}>
              <Route index element={<Generator />} />
            </Route>
            <Route path="/history" element={<AppLayout />}>
              <Route index element={<History />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
