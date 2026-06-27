import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Shell() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 animate-in">
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
