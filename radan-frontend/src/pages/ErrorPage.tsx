import { AlertTriangle } from "lucide-react";

export const ErrorPage = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
    <div className="flex items-center gap-4">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Radan
      </h1>
    </div>
    <p className="mt-2 text-sm text-muted-foreground">
      Oops! Something went wrong.
    </p>
  </div>
);
