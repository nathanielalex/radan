import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Armchair, ChevronRight, LayoutGrid, Palette, UserStar } from "lucide-react";
import { Link } from "react-router";

const miscTools = [
  {
    title: "Manage Genres",
    description: "Add, edit, or remove movie genres available on the platform.",
    icon: Palette,
    href: "/dashboard",
  },
  {
    title: "Manage Auditorium Layouts",
    description:
      "Create and configure seat layouts for different auditorium sizes.",
    icon: LayoutGrid,
    href: "/make-seat-layout",
  },
  {
    title: "Manage Casts",
    description: "Add, edit, or remove cast members available on the platform.",
    icon: UserStar,
    href: "/make-seat-layout",
  },
  {
    title: "Manage Studio Types",
    description: "Add, edit, or remove studio types available on the platform.",
    icon: Armchair,
    href: "/make-seat-layout",
  },
];

export default function DashboardMiscellaneous() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Miscellaneous Tools
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {miscTools.map((tool, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-1.5">
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <tool.icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-6">
              <Link to={tool.href}>
                <Button variant="outline" className="w-full">
                  Go to Page <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
