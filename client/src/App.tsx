import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home-page";
import CreatorForm from "@/pages/creator-form";
import BrandForm from "@/pages/brand-form";
import CreatorProfile from "@/pages/creator-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/creator-form" component={CreatorForm} />
      <Route path="/brand-form" component={BrandForm} />
      <Route path="/creator-profile/:id" component={({ params }) => (
        <CreatorProfile id={params.id} />
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;