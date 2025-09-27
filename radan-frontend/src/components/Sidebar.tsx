import { Clapperboard, Film, LayoutDashboard, Store, Ticket, Wrench } from "lucide-react";
import { Link } from "react-router";

export const Sidebar = () => {
  const navItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      id: "movies",
      icon: Clapperboard,
      label: "Movies",
      href: "/dashboard/movies",
    },
    {
      id: "bookings",
      icon: Ticket,
      label: "Bookings",
      href: "/dashboard/bookings",
    },
    {
      id: "theaters",
      icon: Store,
      label: "Theaters",
      href: "/dashboard/theaters",
    },
    {
      id: "miscellaneous",
      icon: Wrench,
      label: "Miscellaneous",
      href: "/dashboard/miscellaneous",
    },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Film className="h-6 w-6" />
            <span className="">Radan Admin</span>
          </a>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
