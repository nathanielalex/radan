import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-2">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Film className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by a movie lover. © {new Date().getFullYear()} Radan. All
            rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}