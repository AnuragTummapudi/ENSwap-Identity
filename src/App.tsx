import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RainbowKitConfig } from "@/config/rainbowkit";
import { Web3Provider } from "@/contexts/Web3Context";
import Layout from "./components/layout/layout";
import Landing from "./pages/Landing";
import Identity from "./pages/Identity";
import Swap from "./pages/Swap";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <RainbowKitConfig>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/identity" element={<Identity />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </RainbowKitConfig>
);

export default App;
