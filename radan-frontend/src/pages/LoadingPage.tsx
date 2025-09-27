import { Film } from "lucide-react";

export const LoadingPage = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
    <div className="flex items-center gap-4">
      <Film className="h-10 w-10 animate-pulse text-primary" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Radan
      </h1>
    </div>
    <p className="mt-2 text-sm text-muted-foreground">
      Loading your experience...
    </p>
  </div>
);
