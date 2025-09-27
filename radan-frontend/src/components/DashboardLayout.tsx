import { User } from "lucide-react";
import { Outlet } from "react-router";
import { Button } from "./ui/button";
import { Sidebar } from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar Toggle would go here */}
          <div className="w-full flex-1">
            {/* Header Search would go here */}
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <User className="h-4 w-4" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
