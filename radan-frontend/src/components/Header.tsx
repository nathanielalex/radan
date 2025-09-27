import { Film, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { navigateTo } from "@/utils/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Load initial state from localStorage or system preference
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigateTo("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center">
        <div className="mr-4 hidden md:flex ml-2">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Radan</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/movies"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Now Playing
            </Link>
            <Link
              to="/theaters"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Theaters
            </Link>
            <Link
              to="/my-bookings"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Bookings
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun /> : <Moon />}
          </Button>
          <nav className="hidden md:flex items-center">
            {isLoggedIn ? (
              <div className="space-x-2">
                {role == "ROLE_ADMIN" && (
                  <Link to="/dashboard">
                    <Button variant="ghost">
                      dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="secondary" onClick={handleLogout}>
                  logout
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="ghost">login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary">sign up</Button>
                </Link>
              </div>
            )}
          </nav>
          <Button
            variant="ghost"
            className="h-9 w-9 p-0 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container flex flex-col space-y-2 py-4">
            <a
              href="#"
              className="px-2 py-1 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Now Playing
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Coming Soon
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Theaters
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Profile
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
