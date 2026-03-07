import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import PatientDetails from "@/pages/PatientDetails";
import AITriage from "@/pages/AITriage";
import ERCommandCenter from "@/pages/ERCommandCenter";
import MedicineMarketplace from "@/pages/MedicineMarketplace";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/patients/:id" component={PatientDetails}/>
      <Route path="/triage" component={AITriage}/>
      <Route path="/er-board" component={ERCommandCenter}/>
      <Route path="/records">
        {/* Redirecting to dashboard as records are managed inside patient profile */}
        <Redirect to="/" />
      </Route>
      <Route path="/medicine" component={MedicineMarketplace}/>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
