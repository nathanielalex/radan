import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router";

export const NotFoundPage = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
    <div className="flex items-center gap-4">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        404 Not Found
      </h1>
    </div>
    <p className="mt-2 text-sm text-muted-foreground">
      The page you're looking for doesn't exist.
    </p>
    <Link to="/">
      <Button className="mt-4">
        Go back home
      </Button>
    </Link>
  </div>
);
