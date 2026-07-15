import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Shell() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1 animate-in motion-reduce:animate-none">
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
